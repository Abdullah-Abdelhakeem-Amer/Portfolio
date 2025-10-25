# Placeholder Links Documentation

This document lists all placeholder URLs that need to be updated with actual links when available.

## Overview

As part of the startups and projects enhancement feature, several placeholder URLs have been added for GitHub repositories, YouTube demos, and LinkedIn profiles. These placeholders allow the site to function fully while actual links are being prepared.

## Projects with Placeholder Links

The following projects in `data/projects.json` may have placeholder links that need updating:

### GitHub Repository Links

Projects with placeholder GitHub links (marked as `null` or pointing to generic repos):

1. **SeiDrive IVI – Multi-Display Infotainment Platform**
   - Current: `https://github.com/abdullah6484/seidrive-ivi`
   - Update when repository is created/made public

2. **AutoCore Dashboard – Embedded IVI Cluster**
   - Current: `https://github.com/abdullah6484/autocore-dashboard`
   - Update when repository is created/made public

3. **DriveSense IVI – Safety Dashboard**
   - Current: `https://github.com/abdullah6484/drivesense-ivi`
   - Update when repository is created/made public

4. **MotionSync IVI – Native Service Integration**
   - Current: `https://github.com/abdullah6484/motionsync-ivi`
   - Update when repository is created/made public

5. **AutoControl HAL – GPIO/Hardware Control Service**
   - Current: `https://github.com/abdullah6484/autocontrol-hal`
   - Update when repository is created/made public

6. **VisionDrive IVI – Camera & Smart Lighting**
   - Current: `https://github.com/abdullah6484/visiondrive-ivi`
   - Update when repository is created/made public

7. **AOSP Custom ROM**
   - Current: `https://github.com/abdullah6484/aosp-custom-rom-advanced`
   - Update when repository is created/made public

8. **Embedded Android & AOSP Training (SEITech)**
   - Current: `https://github.com/abdullah6484/seitech-training`
   - Update when repository is created/made public

9. **Radar Rollout Gen5 - Porsche**
   - Current: `null` (proprietary - may remain null)
   - Note: Mark as "Proprietary Code" in UI if no public repo

10. **Radar Rollout Gen5 – VW02 & VW04**
    - Current: `null` (proprietary - may remain null)
    - Note: Mark as "Proprietary Code" in UI if no public repo

11. **Driver Monitoring Systems (DMS) – Autosar Team (Bootloader)**
    - Current: `null` (proprietary - may remain null)
    - Note: Mark as "Proprietary Code" in UI if no public repo

12. **Driver Monitoring Systems (DMS) – Application Team**
    - Current: `null` (proprietary - may remain null)
    - Note: Mark as "Proprietary Code" in UI if no public repo

13. **ICG – In Cabin Guard**
    - Current: `null` (proprietary - may remain null)
    - Note: Mark as "Proprietary Code" in UI if no public repo

14. **Cluster Display Product (Car Dashboard)**
    - Current: `https://github.com/abdullah6484/cluster-display`
    - Update when repository is created/made public

15. **Cybersecurity Stack Implementation**
    - Current: `null` (proprietary - may remain null)
    - Note: Mark as "Proprietary Code" in UI if no public repo

16. **SEIHUB (Internal Learning Hub)**
    - Current: `https://github.com/abdullah6484/seihub`
    - Update when repository is created/made public

### YouTube Demo Links

All YouTube links are currently placeholders with format:
- `https://youtube.com/watch?v=[project-name]-demo`

**To Update:**
1. Record and upload demo videos
2. Replace placeholder URLs in `data/projects.json`
3. Format: `https://youtube.com/watch?v=[actual-video-id]`

### LinkedIn Links

Most projects use personal LinkedIn profile as fallback:
- Default: `https://linkedin.com/in/abdullah-abdelhakeem`

**Company-specific projects** should be updated to company LinkedIn pages:
- Radar projects → `https://linkedin.com/company/aptiv`
- DMS projects → `https://linkedin.com/company/aptiv`
- ICG project → `https://linkedin.com/company/aptiv`
- SEITech projects → `https://linkedin.com/company/seitech`

## Startup Placeholder Links

### aospcamp
**Current URLs:**
- LinkedIn: `https://linkedin.com/in/abdullah-abdelhakeem`
- YouTube: `https://youtube.com/@aospcamp`

**Update to:**
- Create dedicated aospcamp LinkedIn company page
- Verify YouTube channel URL
- Add website URL when available

**Files to update:**
- `startups/index.html`
- `startups/aospcamp.html`

### pcodecamp
**Current URLs:**
- LinkedIn: `https://linkedin.com/in/abdullah-abdelhakeem`
- YouTube: `https://youtube.com/@pcodecamp`

**Update to:**
- Create dedicated pcodecamp LinkedIn company page
- Verify YouTube channel URL
- Add website URL when available

**Files to update:**
- `startups/index.html`
- `startups/pcodecamp.html`

### BitPulse
**Current URLs:**
- LinkedIn: `https://linkedin.com/in/abdullah-abdelhakeem`
- YouTube: `https://youtube.com/@bitpulse`
- Listen link: Points to `../podcasts/` (correct)

**Update to:**
- Create dedicated BitPulse LinkedIn company page
- Verify YouTube channel URL
- Add website URL when available

**Files to update:**
- `startups/index.html`
- `startups/bitpulse.html`

## How to Update Links

### For Projects (in data/projects.json):

```json
{
  "id": "project-id",
  "github": "https://github.com/username/actual-repo",
  "youtube": "https://youtube.com/watch?v=actual-video-id",
  "linkedin": "https://linkedin.com/company/actual-company"
}
```

### For Startup Pages:

1. Open the relevant HTML file in `startups/`
2. Find links with placeholder URLs
3. Replace with actual URLs
4. Update aria-label attributes if needed

## Testing After Updates

After updating any links, run:

```bash
# Test that all links are valid
node tests/validation.test.js

# Manual testing
# 1. Click each project card's action buttons
# 2. Verify they lead to correct destinations
# 3. Check that placeholder warnings appear for pending links
```

## Link Behavior for Placeholders

The JavaScript in `assets/js/projects.js` handles placeholder links:

- **GitHub placeholder**: Shows alert "Repository link coming soon!"
- **YouTube placeholder**: Shows alert "Demo video coming soon!"
- **LinkedIn**: Always active (defaults to personal profile)

These behaviors will automatically update once actual URLs are added to `data/projects.json`.

## Priority Order for Updates

1. **High Priority** - Update these first:
   - Featured project demo videos
   - Public GitHub repositories that exist
   - Company LinkedIn pages for professional projects

2. **Medium Priority**:
   - Startup-specific LinkedIn pages
   - Startup YouTube channels
   - Non-proprietary GitHub repositories

3. **Low Priority / Optional**:
   - Proprietary projects (can remain null)
   - Demo videos for internal tools
   - Links to deprecated or archived projects

## Notes

- Projects with `null` GitHub links are typically proprietary and may never have public repositories
- Demo videos can be recorded using screen capture tools (OBS, QuickTime, etc.)
- All external links include `rel="noopener noreferrer"` for security
- All links have proper `aria-label` attributes for accessibility

## Contact

For questions about which links to prioritize or how to update specific placeholders, contact:
- Email: abdullah.abdelhakeem25@gmail.com
- LinkedIn: https://linkedin.com/in/abdullah-abdelhakeem

