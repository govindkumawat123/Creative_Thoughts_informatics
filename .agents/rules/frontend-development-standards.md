---
trigger: always_on
---

# GLOBAL PROJECT RULES — CLEAN CODE, CSS REUSE & COMPONENT REUSE

These rules apply to EVERY project, website, application, page, and component I work on with you in Antigravity.

Treat these as permanent global development rules. Follow them for new features, existing code modifications, UI development, bug fixes, and refactoring.

## 1. ALWAYS INSPECT THE EXISTING PROJECT FIRST

Before writing or modifying code:

- Inspect the project folder structure.
- Identify the framework, libraries, CSS framework, and existing coding conventions.
- Read relevant HTML, JSX, TSX, CSS, SCSS, and component files.
- Search for existing reusable classes, components, utility functions, hooks, and styles.
- Understand how the existing implementation works before changing it.

Never assume that a new class, component, or utility is required without checking what already exists.

## 2. EXISTING CSS CLASSES FIRST — MANDATORY

Before creating any new CSS class, search the existing project for a class that already provides the required styling.

Priority order:

1. Existing project-specific CSS classes.
2. Existing design-system or utility classes.
3. Existing framework utilities, such as Bootstrap or Tailwind, if already installed.
4. A combination of existing classes.
5. A new reusable custom CSS class only when necessary.

If an existing class can achieve the required result, reuse it.

Never duplicate an existing style under a different class name.

## 3. NEVER CREATE UNNECESSARY CLASSES FOR INDIVIDUAL ELEMENTS

Do not create a new class for every paragraph, heading, button, label, card, or image.

Bad approach:

```jsx
<p className="paragraphOne">First paragraph</p>
<p className="paragraphTwo">Second paragraph</p>
<p className="paragraphThree">Third paragraph</p>
```

Preferred approach:

```jsx
<p className="existing-text-class mb-3">
  First paragraph
</p>

<p className="existing-text-class mb-3">
  Second paragraph
</p>

<p className="existing-text-class mb-3">
  Third paragraph
</p>
```

The example class names are illustrative. Always use classes that actually exist in the current project.

Create separate classes only when elements have genuinely different styling or behavior that cannot be handled with existing classes.

## 4. NO DUPLICATE OR REDUNDANT CSS

Never:

- Create multiple classes with identical CSS declarations.
- Add another class when an existing class already handles the requirement.
- Repeat the same CSS selector in multiple places unnecessarily.
- Add overrides without checking the original declaration.
- Create separate stylesheets for small changes when an appropriate existing stylesheet is available.
- Add excessive one-off utility classes for simple spacing, font sizes, colors, or alignment.

Before adding CSS, search for existing equivalent rules and reuse or appropriately extend them.

## 5. USE THE EXISTING CSS FRAMEWORK

If the project already uses Bootstrap, Tailwind CSS, Material UI, Ant Design, or another UI framework:

- Use its existing utilities and components where appropriate.
- Do not introduce another framework without a clear requirement.
- Do not write custom CSS to reproduce functionality that the installed framework already provides.
- Preserve the project's existing visual design and conventions.
- Do not mix incompatible styling approaches unnecessarily.

If the project has its own design system, prioritize that design system over introducing new conventions.

## 6. NO INLINE CSS BY DEFAULT

Do not use inline CSS for ordinary styling.

React example — avoid:

```jsx
<p style={{ fontSize: "15px", marginBottom: "16px" }}>
  Example text
</p>
```

Prefer existing reusable classes:

```jsx
<p className="existing-text-class existing-spacing-class">
  Example text
</p>
```

Use the actual class names available in the project.

If no suitable class exists, add a reusable class to the appropriate existing stylesheet.

Inline styles are allowed only when genuinely necessary, such as dynamic values calculated at runtime, user-controlled theme values, or third-party API requirements that cannot reasonably be handled through classes.

## 7. CREATE NEW CSS CLASSES ONLY WHEN NECESSARY

A new class is allowed only when:

- No existing class satisfies the requirement.
- A suitable combination of existing classes cannot achieve the result cleanly.
- Existing framework utilities cannot satisfy the requirement without compromising the design.
- The new class represents a meaningful, necessary style or reusable component.

When creating a class:

- Follow the naming convention already used in the project.
- Use the project's established prefix if one exists.
- Make the class reusable and descriptive.
- Add it to the appropriate existing stylesheet.
- Avoid duplicate declarations and unnecessary specificity.
- Reuse the new class wherever the same styling is required.

Never impose a new naming prefix on projects that already have their own convention.

## 8. REUSE EXISTING COMPONENTS

Before creating a new component, inspect the project for an existing component that already performs the required job.

Reuse existing components for:

- Headers and navigation.
- Footers.
- Buttons.
- Cards.
- Forms and form fields.
- Modals and dialogs.
- Tables and pagination.
- Breadcrumbs.
- Loaders and empty states.
- Common sections and layouts.

If the component needs a small variation, prefer existing props, variants, composition, or configuration instead of duplicating the entire component.

Create a new component when it provides genuinely new functionality or improves maintainability.

Do not create unnecessary abstractions for trivial one-time elements.

## 9. KEEP CODE CLEAN AND MAINTAINABLE

- Follow the project's existing folder structure and naming conventions.
- Keep components focused and readable.
- Avoid duplicated logic.
- Reuse existing utility functions and API services.
- Avoid unnecessary dependencies.
- Do not rewrite working code without a valid reason.
- Preserve existing functionality while making changes.
- Do not remove code simply because it appears unfamiliar; first understand its purpose.

## 10. PRESERVE DESIGN AND RESPONSIVENESS

When modifying UI:

- Preserve the existing design unless a change is requested.
- Maintain consistent typography, spacing, colors, dimensions, and border radii.
- Follow the project's existing design tokens and responsive breakpoints.
- Check desktop, tablet, and mobile layouts.
- Do not introduce arbitrary margins, padding, or font sizes when existing design-system values are available.
- Avoid unnecessary changes to unrelated components.

## 11. REQUIRED WORKFLOW FOR EVERY TASK

Before implementation:

1. Inspect the relevant project files.
2. Search for existing classes and components.
3. Identify available framework utilities.
4. Plan the smallest change that satisfies the requirement.

During implementation:

5. Reuse existing classes and components first.
6. Write new CSS only for genuinely missing requirements.
7. Avoid duplicate logic and unnecessary files.
8. Follow the project's existing conventions.

After implementation:

9. Review all newly added classes.
10. Remove unnecessary classes and duplicate CSS.
11. Check for unintended visual or functional changes.
12. Verify responsive behavior and test the relevant functionality.

## 12. FINAL SELF-REVIEW IS REQUIRED

Before declaring a task complete, verify:

- Did I search for an existing class before creating a new one?
- Did I create unnecessary classes for individual paragraphs or headings?
- Could existing classes or framework utilities achieve the same result?
- Did I duplicate existing CSS?
- Did I unnecessarily create a component or stylesheet?
- Did I use inline CSS without a valid reason?
- Did I preserve existing design, functionality, and responsiveness?
- Did I follow the current project's conventions?

If any answer reveals unnecessary code, clean it up before completing the task.

## MOST IMPORTANT RULE

DO NOT CREATE NEW CLASSES OR COMPONENTS JUST BECAUSE IT IS EASIER THAN SEARCHING FOR EXISTING ONES.

Inspect first. Reuse first. Extend existing code when appropriate. Create something new only when it is genuinely necessary.

These rules apply to every project and every future coding task unless I explicitly instruct you otherwise.