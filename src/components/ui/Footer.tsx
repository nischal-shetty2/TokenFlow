import { Socials } from "../Socials";

export function Footer() {
  return (
    <footer className="w-full px-5 py-6">
      <div className="items-center space-y-3">
        <div className="container flex flex-col items-center justify-between gap-4">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            All rights reserved TokenFlow™
          </p>
        </div>
        <div className="flex justify-center space-x-7">
          <Socials />
        </div>
      </div>
    </footer>
  );
}
