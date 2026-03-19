export const menuList: MenuItem[] = [
    { label: "Home", path: "/home" },
    {
      label: "Account",
      path: "/account",
      canAccess : ["ADMIN","CUSTOMER"],
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
        { label: "Overview", path: "/dashboard" , canAccess : ["ADMIN"]},
        { label: "Analytics", path: "/dashboard/analytics" , canAccess : ["ADMIN"]},
      ],
    },
    {
      label: "Service",
      path: "/transaction",
      canAccess : ["ADMIN","CUSTOMER"],
      children: [
        { label: "Deposit", path: "/transaction/deposit" , canAccess : ["ADMIN"] },
        { label: "Withdraw", path: "/transaction/withdraw" , canAccess : ["ADMIN"] },
        { label: "Transfer", path: "/transaction/transfer" , canAccess : ["ADMIN","CUSTOMER"]},
      ],
    },
     {
      label: "Admin",
      path: "/admin",
      canAccess : ["ADMIN"],
      children: [
        { label: "User Management", path: "/all/user" , canAccess : ["ADMIN"] },
        { label: "Account Management", path: "/all/account" , canAccess : ["ADMIN"] },
        
       
      ],
    },
  ];


  
export interface MenuItem {
  label: string;
  path: string;
  canAccess? : string[];
  children?: MenuItem[];
}




