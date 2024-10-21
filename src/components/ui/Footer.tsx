import { Socials } from "../Socials";

export function Footer() {
  return (
    <footer className="w-full px-5 py-6 lg:px-8 lg:py-0">
      <div className="items-center space-y-3 lg:flex">
        <div className="container flex flex-col items-center justify-between gap-4 lg:h-24 lg:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground lg:text-left">
            All rights reserved TokenFlow™
          </p>
        </div>
        <div className="flex justify-center space-x-5">
          <Socials />
        </div>
      </div>
    </footer>
  );
}
