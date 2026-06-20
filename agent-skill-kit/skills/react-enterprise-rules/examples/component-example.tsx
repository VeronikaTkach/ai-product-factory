interface IUserProfileCardProps {
  name: string;
  email: string;
  roleLabel: string;
}

export function UserProfileCard({ name, email, roleLabel }: IUserProfileCardProps) {
  return (
    <article className="rounded-md border bg-card p-4 text-card-foreground shadow-sm">
      <div className="space-y-1">
        <h3 className="text-base font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
      <span className="mt-4 inline-flex rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
        {roleLabel}
      </span>
    </article>
  );
}
