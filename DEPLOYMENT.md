# DocTalk - Deployment Guide

## Pre-Deployment Checklist

### Security Review
- ✅ Row Level Security policies verified
- ⚠️ **TODO**: Enable Leaked Password Protection in Supabase Auth Settings
- ✅ Input validation on all forms
- ✅ File upload validation
- ✅ XSS protection implemented
- ✅ HTTPS enforced (ensure in production)

### Performance Optimization
- ✅ Lazy loading implemented for routes
- ✅ Code splitting configured
- ✅ Image optimization
- ✅ Service Worker caching
- ✅ Bundle size optimized

### Testing
- ✅ Authentication flows tested
- ✅ Real-time messaging verified
- ✅ WebRTC calls functional
- ✅ Offline functionality working
- ✅ Mobile responsive design tested

## Deployment Steps

### 1. Build Production Bundle

```bash
npm run build
# or
bun run build
```

This creates an optimized production build in the `dist/` directory.

### 2. Environment Configuration

The Supabase configuration is embedded in the code:
- URL: `https://hbdinpejzjweklkbyydz.supabase.co`
- Project ID: `hbdinpejzjweklkbyydz`

No additional environment variables needed.

### 3. Deploy to Hosting Platform

#### Option A: Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

Configuration (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

#### Option B: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

Configuration (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Option C: Custom Server (nginx)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/doctalk/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # PWA Service Worker
    location /sw.js {
        add_header Cache-Control "no-cache";
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 4. Configure SSL/HTTPS

Ensure SSL certificate is configured for HTTPS:
- **Vercel/Netlify**: Automatic SSL
- **Custom server**: Use Let's Encrypt

```bash
sudo certbot --nginx -d yourdomain.com
```

### 5. Post-Deployment Verification

#### Test Core Features
1. User registration and login
2. Profile management
3. Real-time messaging
4. Voice/video calls (ensure STUN/TURN servers accessible)
5. File uploads to Supabase Storage
6. Push notifications
7. PWA installation

#### Performance Checks
Run Lighthouse audit:
- Performance: Target 90+
- Accessibility: Target 90+
- Best Practices: Target 90+
- SEO: Target 90+
- PWA: Should pass all checks

#### Monitor Errors
Check browser console for:
- JavaScript errors
- Network failures
- WebRTC connection issues

## Production Configuration

### Supabase Settings

#### 1. Enable Leaked Password Protection
Navigate to: [Supabase Auth Settings](https://supabase.com/dashboard/project/hbdinpejzjweklkbyydz/auth/providers)

Enable:
- Password strength requirements
- Leaked password protection

#### 2. Configure CORS
Ensure your production domain is allowed in Supabase CORS settings.

#### 3. Rate Limiting
Consider implementing rate limiting for:
- Login attempts (via Supabase Auth settings)
- API endpoints (via Supabase Edge Functions)

#### 4. Database Backups
Enable automatic backups in Supabase:
- Daily backups recommended
- Retention period: 7-30 days

### PWA Configuration

Ensure `vite.config.ts` has correct PWA settings:
```typescript
VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: 'DocTalk',
    short_name: 'DocTalk',
    description: 'Medical Consultation Platform',
    theme_color: '#1E40AF',
    background_color: '#FFFFFF',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    icons: [
      {
        src: 'icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: 'icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
})
```

## Monitoring & Maintenance

### Error Tracking
Recommended tools:
- Sentry for error tracking
- LogRocket for session replay
- Supabase Dashboard for backend logs

### Performance Monitoring
- Google Analytics for usage metrics
- Lighthouse CI for automated performance checks
- Supabase Analytics for database performance

### Database Maintenance
- Monitor query performance
- Check RLS policy efficiency
- Review storage usage
- Optimize indexes if needed

### Regular Updates
- Security patches: Weekly
- Dependency updates: Monthly
- Feature releases: As needed

## Rollback Procedure

If issues occur post-deployment:

1. **Quick Rollback**: Use platform's rollback feature
   ```bash
   # Vercel
   vercel rollback
   
   # Netlify
   netlify rollback
   ```

2. **Database Rollback**: Restore from Supabase backup if needed

3. **Emergency Maintenance**: Display maintenance page

## Scaling Considerations

### Frontend Scaling
- Vercel/Netlify handle automatic scaling
- CDN caching for static assets
- Consider adding a CDN for Supabase Storage

### Backend Scaling (Supabase)
- Monitor concurrent connections
- Upgrade Supabase plan if needed
- Consider read replicas for heavy read loads
- Optimize database queries

### WebRTC Scaling
- Consider adding TURN servers for better connectivity
- Monitor bandwidth usage
- Implement Twilio as fallback for large scale

## Cost Optimization

### Supabase
- Monitor storage usage
- Optimize file storage (compress images)
- Review database query patterns
- Clean up old data periodically

### Hosting
- Use CDN for static assets
- Enable gzip/brotli compression
- Monitor bandwidth usage

## Support & Troubleshooting

### Common Issues

#### 1. WebRTC Not Working
- Check STUN/TURN server configuration
- Verify browser permissions
- Test on different networks

#### 2. Push Notifications Failing
- Verify service worker registration
- Check notification permissions
- Test in different browsers

#### 3. Offline Sync Issues
- Clear IndexedDB and retry
- Check service worker cache
- Monitor network connectivity

### Getting Help
- Supabase Support: https://supabase.com/support
- Documentation: Check README.md
- Logs: Monitor Supabase Dashboard

---

**Deployment completed successfully! 🚀**
