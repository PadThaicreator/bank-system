export const menuList: MenuItem[] = [
    { label: "Home", path: "/home" },
    {
      label: "Account",
      path: "/account",
      children: [
        { label: "Open Account", path: "/account/open" , canAccess : ["ADMIN","CUSTOMER"]},
        { label: "Account List", path: "/account/list" , canAccess : ["ADMIN","CUSTOMER"]},
      ],
    },
    {
      label: "Dashboard",
      path: "/dashboard",
      canAccess : ["ADMIN"],
      children: [
        { label: "Overview", path: "/dashboard" },
        { label: "Analytics", path: "/dashboard/analytics" },
      ],
    },
    {
      label: "Service",
      path: "/transaction",
      children: [
        { label: "Deposit", path: "/transaction/deposit" , canAccess : ["ADMIN"] },
        { label: "Withdraw", path: "/transaction/withdraw" , canAccess : ["ADMIN"] },
        { label: "Transfer", path: "/transaction/transfer" , canAccess : ["ADMIN","CUSTOMER"]},
      ],
    },
     {
      label: "Admin",
      path: "/admin",
      children: [
        { label: "User List", path: "/transaction/deposit" , canAccess : ["ADMIN"] },
        { label: "", path: "/transaction/withdraw" , canAccess : ["ADMIN"] },
        { label: "Transfer", path: "/transaction/transfer" , canAccess : ["ADMIN","CUSTOMER"]},
      ],
    },
  ];


  
export interface MenuItem {
  label: string;
  path: string;
  canAccess? : string[];
  children?: MenuItem[];
}

