import Image from "next/image";
import Logo from '@/public/Logo.png'

type HeaderProps = {
  label: string;
};

const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <div className="flex items-center justify-center">
        <Image src={Logo} alt="Logo" width={250} height={250}/>
        <h1 className="text-3xl font-semibold text-primary drop-shadow-md">
        </h1>
      </div>

      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};

export default Header;
