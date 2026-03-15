# Component Template

## Structure

```tsx
interface {Name}Props {
  // Required props
  value: number;
  label: string;
  // Optional props
  className?: string;
  onClick?: () => void;
}

export function {Name}({ value, label, className, onClick }: {Name}Props) {
  return (
    <div className={`{base-classes} ${className ?? ''}`} onClick={onClick}>
      {/* Component content */}
    </div>
  );
}
```

## Rules

- Export as named export (not default)
- Props interface defined in same file
- Use Tailwind CSS classes
- Accept optional `className` for customization
- Keep logic minimal — compute in hooks/utils, display in components
