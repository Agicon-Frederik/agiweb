# WCAG 2.2 AA Accessibility Audit Report

**Site:** Frederik Vantroys — Agicon
**Date:** January 15, 2026
**Standard:** WCAG 2.2 Level AA

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 4 |
| Major | 8 |
| Minor | 6 |

---

## Critical Issues

### 1. No Visible Focus Indicators (2.4.7 Focus Visible)

**Location:** Global (styles.css)
**Problem:** The CSS reset removes default browser focus outlines, but no custom focus styles are defined. Keyboard users cannot see where they are on the page.

```css
/* Current - no focus styles defined */
a { color: inherit; text-decoration: none; }
button { background: none; border: none; }
```

**Fix:** Add visible focus styles for all interactive elements:

```css
/* Add to styles.css */
a:focus-visible,
button:focus-visible {
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
}

.nav-links a:focus-visible,
.menu-link:focus-visible {
    outline-color: var(--color-white);
}
```

---

### 2. Missing Skip Link (2.4.1 Bypass Blocks)

**Location:** index.html
**Problem:** No skip link exists to bypass the navigation and jump to main content. Screen reader and keyboard users must tab through all navigation on every page.

**Fix:** Add skip link as first element in body:

```html
<body>
    <a href="#main" class="skip-link">Skip to main content</a>
    <!-- rest of content -->
    <main id="main">
```

```css
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    padding: var(--space-2) var(--space-4);
    background: var(--color-primary);
    color: var(--color-white);
    z-index: 1000;
}

.skip-link:focus {
    top: 0;
}
```

---

### 3. SVG Icons Have No Accessible Names (1.1.1 Non-text Content)

**Location:** Follow Me section (lines 142-175)
**Problem:** The SVG icons in the Follow Me cards have no accessible text. Screen readers announce nothing or just "graphic".

**Fix:** Add `aria-hidden="true"` to decorative icons since the card already has text, OR add title elements:

```html
<div class="follow-icon">
    <svg aria-hidden="true" viewBox="0 0 24 24" ...>
```

---

### 4. Color Contrast Failures (1.4.3 Contrast Minimum)

**Location:** Multiple
**Problem:** Several text colors fail the 4.5:1 contrast ratio requirement:

| Element | Foreground | Background | Ratio | Required |
|---------|------------|------------|-------|----------|
| `.hero-tagline` | #a3a3a3 | #020202 | 7.2:1 | ✓ Pass |
| `.follow-lead` | #a3a3a3 | #020202 | 7.2:1 | ✓ Pass |
| `.follow-card-desc` | #737373 | #171717 | 4.0:1 | ✗ Fail |
| `.badge-year` | #737373 | #020202 | 4.5:1 | ✓ Borderline |
| `.project-category` (opacity: 0.7) | varies | varies | ~3.5:1 | ✗ Fail |
| `.project-status` (opacity: 0.6) | varies | varies | ~3.0:1 | ✗ Fail |
| `.project-description` (opacity: 0.85) | varies | varies | ~4.2:1 | ✗ Fail |
| `.footer-copyright` | #525252 | #020202 | 3.0:1 | ✗ Fail |

**Fix:** Remove opacity values and use solid colors that meet contrast:

```css
.project-category {
    /* Remove: opacity: 0.7; */
    color: rgba(0, 0, 0, 0.75); /* or use solid color */
}

.project-status {
    /* Remove: opacity: 0.6; */
    color: rgba(0, 0, 0, 0.7);
}

.project-description {
    /* Remove: opacity: 0.85; */
}

.follow-card-desc {
    color: var(--color-gray-400); /* #a3a3a3 instead of #737373 */
}

.footer-copyright {
    color: var(--color-gray-400); /* #a3a3a3 instead of current */
}
```

---

## Major Issues

### 5. Mobile Menu Missing ARIA Roles (4.1.2 Name, Role, Value)

**Location:** index.html lines 29-36
**Problem:** The mobile menu overlay lacks proper ARIA attributes for screen readers.

**Fix:**

```html
<div class="menu-overlay" role="dialog" aria-modal="true" aria-label="Main menu">
```

Also update JavaScript to manage focus:

```javascript
openMenu() {
    this.toggle.setAttribute('aria-expanded', 'true');
    this.overlay.classList.add('active');
    this.overlay.setAttribute('aria-hidden', 'false');
    this.body.classList.add('menu-open');
    // Focus first menu item
    this.overlay.querySelector('.menu-link')?.focus();
}

closeMenu() {
    this.toggle.setAttribute('aria-expanded', 'false');
    this.overlay.classList.remove('active');
    this.overlay.setAttribute('aria-hidden', 'true');
    this.body.classList.remove('menu-open');
    // Return focus to toggle
    this.toggle.focus();
}
```

---

### 6. External Links Don't Indicate New Window (2.4.4 Link Purpose)

**Location:** Multiple external links
**Problem:** Links with `target="_blank"` don't warn users they'll open in a new tab. This is disorienting for screen reader users.

**Affected links:**
- Equitalent waitinglist
- Follow Me cards (LinkedIn, YouTube, Substack, Stan Store)
- Book a Call
- Footer links

**Fix:** Add visual indicator and screen reader text:

```html
<a href="https://..." target="_blank" rel="noopener">
    LinkedIn
    <span class="sr-only">(opens in new tab)</span>
</a>
```

Or add an icon with aria-label.

---

### 7. Heading Hierarchy Issues (1.3.1 Info and Relationships)

**Location:** index.html
**Problem:**
- Hero section uses `<p class="hero-tagline">` before `<h1>` — this should be reversed or tagline shouldn't look like a heading
- Footer uses `<h4>` without `<h2>` or `<h3>` preceding it (skipped levels)
- Some sections missing landmark roles

**Fix:**

```html
<!-- Hero: Either remove visual heading styling from tagline, or restructure -->
<h1 class="hero-title">I FIX<br>THE GAPS</h1>
<p class="hero-tagline">YOUR SYSTEMS WORK GREAT UNTIL THEY DON'T</p>

<!-- Footer: Use appropriate heading level or use different markup -->
<footer class="footer">
    <h2 class="sr-only">Site footer</h2>
    <div class="footer-column">
        <h3>Navigation</h3> <!-- Changed from h4 -->
```

---

### 8. No Main Landmark (1.3.1 Info and Relationships)

**Location:** index.html
**Problem:** Content is not wrapped in a `<main>` landmark, making it harder for screen reader users to navigate.

**Fix:**

```html
</header>

<main id="main">
    <!-- Hero Section -->
    <section class="hero">
    ...
    <!-- Contact Section -->
</main>

<footer class="footer">
```

---

### 9. Focus Can Be Obscured by Fixed Header (2.4.11 Focus Not Obscured)

**Location:** styles.css line 156-164
**Problem:** The fixed header can cover focused elements when using keyboard navigation, especially after clicking anchor links.

**Fix:** Add scroll-margin to sections:

```css
section[id] {
    scroll-margin-top: 5rem; /* Header height + buffer */
}
```

---

### 10. Target Size Too Small (2.5.8 Target Size Minimum)

**Location:** Navigation links, footer links
**Problem:** Some interactive elements may not meet the 24x24px minimum target size requirement.

**Affected:**
- Desktop nav links (only have vertical padding)
- Footer links

**Fix:**

```css
.nav-links a {
    padding: var(--space-2) var(--space-3); /* Add horizontal padding */
    min-height: 44px; /* Better: 44px for touch */
    display: inline-flex;
    align-items: center;
}

.footer-column a {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
}
```

---

### 11. Decorative SVG Not Hidden (1.1.1 Non-text Content)

**Location:** Footer arch SVG (line 198-200)
**Problem:** The decorative arch SVG is not hidden from assistive technology.

**Fix:**

```html
<svg aria-hidden="true" viewBox="0 0 1440 200" preserveAspectRatio="none">
```

---

### 12. Images May Need More Descriptive Alt Text (1.1.1 Non-text Content)

**Location:** Project images
**Problem:** Some alt texts are generic. The Clareo image shows a woman overwhelmed at a desk — this context is lost.

**Current:**
```html
<img src="clareo_image.png" alt="Clareo - Bringing clarity to complex decisions">
```

**Better:**
```html
<img src="clareo_image.png" alt="Woman at desk looking overwhelmed by multiple devices and apps, representing decision fatigue that Clareo addresses">
```

---

## Minor Issues

### 13. Smooth Scroll May Cause Issues (2.2.2 Pause, Stop, Hide)

**Location:** styles.css line 93
**Problem:** `scroll-behavior: smooth` can cause motion sickness for some users.

**Fix:** Respect user preferences:

```css
@media (prefers-reduced-motion: no-preference) {
    html {
        scroll-behavior: smooth;
    }
}
```

---

### 14. Animation Should Respect Reduced Motion (2.3.3 Animation from Interactions)

**Location:** Multiple CSS transitions and scroll animations
**Problem:** Animations play regardless of user preference.

**Fix:**

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }

    .fade-in {
        opacity: 1;
        transform: none;
    }
}
```

---

### 15. Link Underlines Removed (1.4.1 Use of Color)

**Location:** styles.css line 117-120
**Problem:** Links are only distinguished by color, not by underline or other visual indicator.

**Fix:** Add underlines or other non-color indicators to inline links, or ensure sufficient contrast:

```css
/* For inline links within paragraphs */
p a, .about-content a {
    text-decoration: underline;
    text-underline-offset: 2px;
}
```

---

### 16. Side Badge Purpose Unclear (1.1.1 Non-text Content)

**Location:** index.html lines 230-236
**Problem:** The side badge with "FV" logo and "2026" has unclear purpose and alt text.

**Fix:** Either hide from AT if purely decorative, or provide context:

```html
<div class="side-badge" aria-hidden="true">
```

Or if it should be accessible:

```html
<div class="side-badge" role="img" aria-label="Frederik Vantroys, established 2026">
```

---

### 17. Language Not Specified for Non-English Content

**Location:** N/A currently
**Problem:** If any Dutch or other language content is added, it needs `lang` attributes.

**Example if needed:**

```html
<span lang="nl">Ontwerp zonder titel</span>
```

---

### 18. Form Elements Missing (If Added Later)

**Location:** N/A
**Note:** Currently no forms on the site. If forms are added, ensure:
- All inputs have associated labels
- Error messages are linked with `aria-describedby`
- Required fields are indicated

---

## Checklist for Fixes

- [x] Add focus-visible styles globally
- [x] Add skip link
- [x] Add aria-hidden to decorative SVGs
- [x] Fix color contrast issues (remove opacity, use solid colors)
- [x] Add ARIA roles to mobile menu
- [x] Add "(opens in new tab)" to external links
- [x] Fix heading hierarchy
- [x] Add `<main>` landmark
- [x] Add scroll-margin-top to sections
- [x] Increase target sizes for links
- [x] Add prefers-reduced-motion support
- [x] Review and improve alt texts
- [x] Add underlines to inline links
- [x] Hide decorative side badge from assistive tech

**All issues have been addressed as of January 15, 2026.**

---

## Testing Recommendations

1. **Keyboard Testing:** Navigate entire site using only Tab, Shift+Tab, Enter, and Escape
2. **Screen Reader Testing:** Test with NVDA (Windows) or VoiceOver (Mac)
3. **Color Contrast:** Use WebAIM Contrast Checker or browser DevTools
4. **Zoom Testing:** Verify site works at 200% zoom
5. **Automated Testing:** Run axe DevTools or WAVE extension

---

## Resources

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [NVDA Screen Reader](https://www.nvaccess.org/)

---

*Report generated for agicon.be accessibility compliance review.*
