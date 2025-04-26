import { IconType } from "react-icons";

interface AdminNavItemProps {
    label: string;
    icon: IconType;
    selected?: boolean;
    }
const AdminNavItem:React.FC<AdminNavItemProps> = ({selected, icon: Icon, label}) => {
    return (<div className={`flex items-center justify-center text-center gap-1 p-2 
        border-b-2 hover:text-slate-800 tramsition cursor-pointer
        ${selected ? 'border-b-slate-800 text-slate-800' : 'border-transparent text-slate-500'}`}>
            <Icon size={20} />
            <div className="font-medium text-sm text-center break-normal">{label}</div>
        </div>  );
}
 
export default AdminNavItem;