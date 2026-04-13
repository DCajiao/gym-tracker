interface PageHeaderProps {
  children: React.ReactNode;
}

const PageHeader = ({ children }: PageHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-[hsl(240_10%_4%)] border-b border-border">
      <div className="max-w-lg mx-auto px-4 py-3">
        {children}
      </div>
    </header>
  );
};

export default PageHeader;
