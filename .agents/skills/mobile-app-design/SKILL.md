---
name: Mobile App Design Standards
description: This skill should be used when designing mobile UI, reviewing app design, checking UI guidelines, improving app UX, following iOS Human Interface Guidelines and Android Material Design, accessibility WCAG contrast, and touch target standards.
version: 1.0.0
---

# Mobile App Design Standards (iOS & Android)

Comprehensive guidance for designing mobile applications that follow platform conventions, accessibility standards, and modern UX best practices.

## Core Design Principles

### 1. Platform-Native Conventions (iOS Human Interface Guidelines)
- **Navigation**: Back button in top-left, primary action in top-right or sticky bottom action bar.
- **Tab bar**: Bottom navigation with 3–5 primary items + overflow sheet.
- **Typography**: Clear scale (Large Title 28–34pt, Title 20–22pt, Body 15–16pt, Caption 12–13pt). No text smaller than 11pt.
- **Haptic feedback**: Light vibrations (10–30ms) for confirmations, state changes, and tactile feedback.
- **Safe Area Insets**: Always respect `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` for notch, Dynamic Island, and Home bar.

### 2. Touch Targets and Spacing
- **Minimum Size**: 44 × 44 points/pixels for ALL interactive elements (buttons, checkboxes, chips, icons).
- **Spacing**: Minimum 8pt between adjacent touch targets to prevent accidental taps.
- **Thumb Zone Optimization**: Keep primary actions in the bottom half of the screen for natural one-handed thumb reach.

### 3. Color, Contrast and Accessibility (WCAG 2.1 AA)
- **Text Contrast**: Normal text $\ge 4.5:1$, Large text ($18\text{pt}+$) $\ge 3:1$.
- **Dark Mode**: High contrast text against charcoal/dark surface with subtle glowing active states.
- **Multi-modal feedback**: Don't rely solely on color; combine color with icons, text labels, and haptics.
