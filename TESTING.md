# DocTalk - Testing Guide

## Testing Strategy

### Manual Testing
Due to the complexity of real-time features, WebRTC, and medical workflows, comprehensive manual testing is currently the primary QA method.

### Future Testing Improvements
- Unit tests with Vitest
- Integration tests with React Testing Library
- E2E tests with Playwright/Cypress
- API tests for Supabase functions

## Manual Testing Checklist

### 1. Authentication & User Management

#### Registration Flow (Doctor A)
- [ ] Navigate to `/register`
- [ ] Select "General Practitioner" tab
- [ ] Fill in all required fields:
  - [ ] Email (valid format)
  - [ ] Password (min 8 chars, meets requirements)
  - [ ] Confirm password (matches)
  - [ ] Full name
  - [ ] Medical license
- [ ] Submit registration
- [ ] Verify email verification prompt
- [ ] Check Supabase Auth Users table

#### Registration Flow (Doctor B)
- [ ] Repeat above with "Specialist" tab selected
- [ ] Verify role assignment in database

#### Login Flow
- [ ] Navigate to `/login`
- [ ] Test with Doctor A credentials
- [ ] Verify redirect to `/doctor-a/home`
- [ ] Logout
- [ ] Test with Doctor B credentials
- [ ] Verify redirect to `/doctor-b/home`
- [ ] Test "Remember Me" functionality
- [ ] Test invalid credentials (should show error)

#### Password Reset
- [ ] Click "Forgot Password"
- [ ] Enter registered email
- [ ] Verify reset email received
- [ ] Click reset link
- [ ] Set new password
- [ ] Login with new password

### 2. Doctor A Features

#### Dashboard
- [ ] View welcome message with doctor name
- [ ] Check quick stats display
- [ ] View recent consultations
- [ ] Click "New Consultation" button
- [ ] Verify pending patient cases section
- [ ] Check notifications panel

#### Department Selection
- [ ] Navigate to departments view
- [ ] View department grid
- [ ] Use search functionality
- [ ] Click on a department
- [ ] Verify navigation to specialists list

#### Specialist Discovery
- [ ] View available specialists
- [ ] Check specialist cards show:
  - [ ] Profile photo
  - [ ] Name and specialization
  - [ ] Rating (if available)
  - [ ] Availability status
  - [ ] Distance/location
- [ ] Test filter options
- [ ] Test sort options
- [ ] Click "Consult Now" on available specialist

#### Consultation Interface
- [ ] Verify consultation screen loads
- [ ] Test text messaging:
  - [ ] Send message
  - [ ] Receive response
  - [ ] View message history
  - [ ] See typing indicators
  - [ ] Check read receipts
- [ ] Test file attachment:
  - [ ] Upload valid file (image, PDF)
  - [ ] Verify file preview
  - [ ] Check file size validation
  - [ ] Test invalid file type (should reject)
- [ ] Test voice call:
  - [ ] Initiate call
  - [ ] Check microphone permissions
  - [ ] Verify call connection
  - [ ] Test mute/unmute
  - [ ] End call
- [ ] Test video call:
  - [ ] Initiate video call
  - [ ] Check camera/mic permissions
  - [ ] Verify video feeds display
  - [ ] Test camera toggle
  - [ ] Test mute/unmute
  - [ ] End call
- [ ] End consultation

#### Case Summary
- [ ] View consultation summary
- [ ] Test "Close Case" option
- [ ] Test "Refer to Hospital" option:
  - [ ] Fill patient details form
  - [ ] Submit referral
  - [ ] Verify referral created in database

#### Patient Management
- [ ] Navigate to "My Patients"
- [ ] View patient list
- [ ] Use search functionality
- [ ] Test filters
- [ ] Click on patient
- [ ] View patient details:
  - [ ] Medical history
  - [ ] Consultation timeline
  - [ ] Attached documents
  - [ ] Current medications
  - [ ] Referral status
- [ ] Add new patient:
  - [ ] Fill patient form
  - [ ] Submit
  - [ ] Verify patient created

#### Consultation History
- [ ] View consultation history
- [ ] Test date range filter
- [ ] Use search functionality
- [ ] Filter by department
- [ ] Filter by specialist
- [ ] View consultation details
- [ ] Test export functionality (if implemented)

#### Profile Management
- [ ] Navigate to profile
- [ ] Update profile photo
- [ ] Edit personal information
- [ ] Update medical credentials
- [ ] Change notification preferences
- [ ] Save changes
- [ ] Verify updates in database

### 3. Doctor B Features

#### Dashboard
- [ ] View availability toggle
- [ ] Check daily stats
- [ ] View pending consultation requests
- [ ] Check active consultations
- [ ] View recent consultations
- [ ] Check earnings summary (if implemented)

#### Availability Management
- [ ] Toggle online/offline status
- [ ] Verify status updates in real-time
- [ ] Set daily schedule
- [ ] Configure break times
- [ ] Set auto-offline timer
- [ ] Set consultation limits
- [ ] Update notification preferences

#### Incoming Consultations
- [ ] Receive consultation request notification
- [ ] View Doctor A profile
- [ ] Check case preview
- [ ] See urgency indicator
- [ ] Test "Accept" button
- [ ] Test "Decline" button
- [ ] Test quick response templates
- [ ] Test transfer option

#### Active Consultation
- [ ] View consultation interface
- [ ] Test all communication modes (text/voice/video)
- [ ] Access patient case history
- [ ] Use medical reference tools
- [ ] Provide recommendations
- [ ] Create referral recommendation
- [ ] Add case notes
- [ ] End consultation

#### Patient Referral Management
- [ ] View referred patients list
- [ ] Check patient status indicators
- [ ] View admission requests
- [ ] Test follow-up scheduling
- [ ] Use search and filters
- [ ] Test bulk actions (if implemented)
- [ ] Export patient data (if implemented)

#### Doctor Network
- [ ] View referring doctors list
- [ ] Check consultation stats per doctor
- [ ] View doctor profiles
- [ ] See communication history
- [ ] Provide ratings/feedback
- [ ] Test block/unblock functionality
- [ ] Mark preferred doctors

#### Professional Profile
- [ ] Setup professional profile
- [ ] Add specialization details
- [ ] Update hospital affiliation
- [ ] Set consultation rates (if implemented)
- [ ] Configure available time slots
- [ ] Upload credentials
- [ ] View reviews and ratings

### 4. Real-time Features

#### Messaging
- [ ] Open consultation from both doctor accounts
- [ ] Send message from Doctor A
- [ ] Verify instant receipt on Doctor B
- [ ] Test typing indicators
- [ ] Test message read status
- [ ] Test offline message queueing
- [ ] Verify message sync when back online

#### Consultation Status
- [ ] Start consultation as Doctor A
- [ ] Verify status update on Doctor B dashboard
- [ ] Change consultation status
- [ ] Verify real-time update

#### Availability Status
- [ ] Change Doctor B availability
- [ ] Verify update in Doctor A specialist list
- [ ] Test real-time status indicators

### 5. WebRTC Communication

#### Voice Calls
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile browsers
- [ ] Check audio quality
- [ ] Test on different networks (WiFi, 4G)
- [ ] Test call duration tracking
- [ ] Test call reconnection

#### Video Calls
- [ ] Test on multiple browsers
- [ ] Check video quality
- [ ] Test camera switching
- [ ] Test screen sharing (if implemented)
- [ ] Test bandwidth adaptation
- [ ] Test call quality indicators
- [ ] Test on mobile devices

### 6. Offline Functionality

#### Offline Mode
- [ ] Disconnect internet
- [ ] Verify offline indicator appears
- [ ] Take consultation notes offline
- [ ] Save patient data offline
- [ ] Reconnect internet
- [ ] Verify automatic sync
- [ ] Check sync notification
- [ ] Verify data integrity

#### PWA Features
- [ ] Install app on desktop
- [ ] Install app on mobile
- [ ] Test app icon and splash screen
- [ ] Verify offline caching
- [ ] Test push notifications
- [ ] Check service worker registration

### 7. Location-based Features

#### Location Services
- [ ] Grant location permission
- [ ] Use "My Location" in search
- [ ] Verify distance calculations
- [ ] Test proximity-based search
- [ ] Adjust max distance filter
- [ ] Verify sorting by distance

### 8. File Management

#### File Uploads
- [ ] Upload profile photo
- [ ] Upload medical document
- [ ] Test supported file types:
  - [ ] JPEG
  - [ ] PNG
  - [ ] PDF
  - [ ] DOCX
- [ ] Test file size limits
- [ ] Verify upload progress
- [ ] Check file preview
- [ ] Test file download
- [ ] Verify file deletion

### 9. Analytics & Reporting

#### Doctor A Analytics
- [ ] View consultation metrics
- [ ] Check completion rates
- [ ] View consultations by type
- [ ] Check daily/weekly trends
- [ ] Verify average duration

#### Doctor B Analytics
- [ ] View performance metrics
- [ ] Check consultation frequency
- [ ] View successful referrals
- [ ] Check response time stats

### 10. Security Testing

#### Authentication
- [ ] Test session timeout
- [ ] Verify auto-logout after inactivity
- [ ] Test token refresh
- [ ] Attempt access without authentication
- [ ] Test role-based access:
  - [ ] Doctor A cannot access Doctor B routes
  - [ ] Doctor B cannot access Doctor A routes

#### Data Access
- [ ] Verify RLS policies:
  - [ ] User A cannot read User B's profile
  - [ ] Cannot access other doctors' patients
  - [ ] Cannot read other consultations
- [ ] Test file access controls
- [ ] Verify private data protection

#### Input Validation
- [ ] Test XSS attempts in messages
- [ ] Test SQL injection in search
- [ ] Test file upload validation
- [ ] Test form validation bypassing
- [ ] Test malicious URLs

### 11. Performance Testing

#### Load Times
- [ ] Measure initial page load
- [ ] Check Time to Interactive
- [ ] Verify Largest Contentful Paint
- [ ] Test lazy loading
- [ ] Check bundle size

#### Responsiveness
- [ ] Test on desktop (1920x1080)
- [ ] Test on laptop (1366x768)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Test on large mobile (414x896)

#### Network Conditions
- [ ] Test on fast 3G
- [ ] Test on slow 3G
- [ ] Test on 4G
- [ ] Test on WiFi
- [ ] Test with intermittent connectivity

### 12. Browser Compatibility

#### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Mobile Browsers
- [ ] Mobile Chrome
- [ ] Mobile Safari
- [ ] Mobile Firefox
- [ ] Samsung Internet

### 13. Accessibility

#### Keyboard Navigation
- [ ] Navigate entire app with keyboard
- [ ] Test tab order
- [ ] Test focus indicators
- [ ] Verify all interactive elements accessible

#### Screen Reader
- [ ] Test with screen reader
- [ ] Verify ARIA labels
- [ ] Check form labels
- [ ] Test navigation landmarks

#### Visual
- [ ] Test color contrast
- [ ] Verify text scalability
- [ ] Test with reduced motion
- [ ] Check focus indicators

## Bug Report Template

When reporting bugs, include:

```markdown
### Bug Description
[Clear description of the issue]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [...]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Device: [e.g., Desktop]
- User Type: [Doctor A / Doctor B]

### Screenshots
[If applicable]

### Console Errors
[If any]

### Priority
- [ ] Critical (blocks core functionality)
- [ ] High (major feature broken)
- [ ] Medium (minor issue)
- [ ] Low (cosmetic issue)
```

## Testing Tools

### Recommended Browser Extensions
- React DevTools
- Lighthouse
- axe DevTools (accessibility)
- Web Vitals

### Network Testing
- Chrome DevTools Network tab
- Throttling in DevTools
- Charles Proxy or similar

### Database Testing
- Supabase Dashboard
- SQL Editor for manual queries
- Table Editor for data verification

## Automated Testing (Future)

### Setup Vitest
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Example Unit Test
```typescript
import { describe, it, expect } from 'vitest';
import { calculateDistance } from '@/utils/location';

describe('calculateDistance', () => {
  it('calculates distance between two points', () => {
    const point1 = { lat: 40.7128, lng: -74.0060 }; // NYC
    const point2 = { lat: 51.5074, lng: -0.1278 }; // London
    const distance = calculateDistance(point1, point2);
    expect(distance).toBeCloseTo(5570, 0); // ~5570 km
  });
});
```

---

**Testing is crucial for medical applications. Always test thoroughly before deployment.**
