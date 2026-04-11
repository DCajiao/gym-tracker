interface PageHeaderProps {
  children: React.ReactNode;
}

const PageHeader = ({ children }: PageHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-lg mx-auto px-4 py-3">
        {children}
      </div>
    </header>
  );
};

export default PageHeader;
