export const menuList: MenuItem[] = [
    { label: "Home", path: "/home" , canAccess : ["ADMIN","CUSTOMER"] },
    {
      label: "Account",
      path: "/account",
      canAccess : ["ADMIN","CUSTOMER"],
      children: [
        { label: "Open Account", path: "/account/open" , canAccess : ["ADMIN","CUSTOMER"]},
        { label: "My Account", path: "/account/list" , canAccess : ["ADMIN","CUSTOMER"]},
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
      label: "Transaction",
      path: "/transaction",
      canAccess : ["ADMIN","CUSTOMER"],
      children: [
        { label: "Service", path: "/transaction/service" , canAccess : ["ADMIN","CUSTOMER"] },

        { label: "History", path: "/transaction/history" , canAccess : ["ADMIN","CUSTOMER"]},
      ],
    },
     {
      label: "Admin",
      path: "/admin",
      canAccess : ["ADMIN"],
      children: [
        { label: "User Management", path: "/admin/user" , canAccess : ["ADMIN"] },
        { label: "Account Management", path: "/admin/accountList" , canAccess : ["ADMIN"] },
        
       
      ],
    },
  ];


  
export interface MenuItem {
  label: string;
  path: string;
  canAccess? : string[];
  children?: MenuItem[];
}




