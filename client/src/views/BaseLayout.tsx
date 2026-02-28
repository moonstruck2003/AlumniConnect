import { ReactNode, useState } from "react";
import { CreateSessionDialog } from "./CreateSessionDialog";

interface BaseLayoutProps {
  children: ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="layout">

      <main id="content">{children}</main>

      <CreateSessionDialog open={isCreateDialogOpen} setOpen={setIsCreateDialogOpen} />
    </div>
  );
};

export default BaseLayout;
