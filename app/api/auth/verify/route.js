import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';
import { connectDB, getTenantModel } from '@/lib/mongodb';

const EMAIL_SECRET = process.env.EMAIL_SECRET || 'your-secret-key';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const EXTERNAL_APP_URL = 'https://app.liveplus.pro'; // Define the external domain

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let token = searchParams.get('token');
    let tenant = searchParams.get('tenant');
    
    // Get base URL for error redirects only
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    // Basic validation
    if (!token) {
      console.error('No token provided');
      return NextResponse.redirect(new URL(`${baseUrl}/?error=invalid-token`));
    }

    // Verify the email token first
    let decoded;
    try {
      decoded = jwt.verify(token, EMAIL_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.redirect(new URL(`${baseUrl}/?error=invalid-token`));
    }

    // If tenant is missing from URL, try to get it from token
    if (!tenant && decoded.tenant) {
      tenant = decoded.tenant;
      console.log('Retrieved tenant from token:', tenant);
    }

    // Validate tenant
    if (!tenant) {
      console.error('No tenant provided');
      return NextResponse.redirect(new URL(`${baseUrl}/?error=invalid-tenant`));
    }

    // Verify tenant matches token
    if (tenant !== decoded.tenant) {
      console.error('Tenant mismatch:', { urlTenant: tenant, tokenTenant: decoded.tenant });
      return NextResponse.redirect(new URL(`${baseUrl}/?error=invalid-tenant`));
    }

    // Create tenant URL for the external domain
    const tenantUrl = `${EXTERNAL_APP_URL}/${tenant}/financeiro`;

    // Connect to tenant's database
    let tenantConnection;
    try {
      tenantConnection = await connectDB(tenant);
    } catch (error) {
      console.error('Database connection failed:', error);
      return NextResponse.redirect(new URL(`${tenantUrl}/?error=database-error`));
    }

    const User = getTenantModel(tenantConnection, 'User');
    
    // Find or create user
    let user;
    try {
      // Agora o middleware pre-save do schema lidará com a definição de role
      user = await User.findOne({ email: decoded.email });
      
      if (user && !user.tenantPath) {
        user.tenantPath = tenant;
        await user.save();
      } else if (!user) {
        // Create new user - não precisamos definir explicitamente o papel aqui
        // O middleware pre-save irá verificar e atribuir 'owner' se for o primeiro usuário
        user = new User({
          email: decoded.email,
          tenantPath: tenant,
          // O campo role usará o padrão ou será modificado pelo middleware
          createdAt: new Date(),
          lastLoginAt: new Date()
        });
        await user.save();
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();
    } catch (error) {
      console.error('User operations failed:', error);
      return NextResponse.redirect(new URL(`${tenantUrl}/?error=user-error`));
    }

    // Add debug logging
    console.log('User login:', { 
      userId: user._id,
      email: user.email,
      tenantPath: user.tenantPath,
      role: user.role,
      token: token.substring(0, 10) + '...'
    });
    
    // Create a session token with the external domain information
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const sessionToken = await new SignJWT({ 
        email: decoded.email,
        userId: user._id.toString(),
        tenantPath: user.tenantPath,
        role: user.role,
        authenticated: true,
        externalDomain: EXTERNAL_APP_URL // Add external domain info to the token
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(secret);

      // Set the session cookie with domain configuration for cross-domain
      const cookieStore = await cookies();
      await cookieStore.set('auth_token', sessionToken, {
        httpOnly: true,
        secure: true, // Always use secure for external domains
        sameSite: 'none', // Allow cross-domain cookies
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
        domain: '.liveplus.pro' // Set the root domain for the cookie
      });

      // Redirect to the external domain with the tenant path
      const redirectUrl = `${tenantUrl}`;
      console.log('Redirecting to:', redirectUrl);
      return NextResponse.redirect(new URL(redirectUrl));
    } catch (error) {
      console.error('Session creation failed:', error);
      return NextResponse.redirect(new URL(`${tenantUrl}/?error=session-error`));
    }
  } catch (error) {
    console.error('Verification error:', error);
    const errorUrl = `${process.env.NEXT_PUBLIC_APP_URL}/?error=server-error`;
    return NextResponse.redirect(new URL(errorUrl));
  }
}
