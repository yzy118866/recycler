const routes = [
  {
    path: '/no-role',
    name: 'NoRole',
    component: () => import("pages/user/NoRolePage.vue"),
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "index",
      },
     
      {
        path: "companies",
        children: [
          {
            path: "",
            component: () => import("pages/admin/AdminCompanies.vue"),
            name: "companies"
          },
          {
            path: ":id",
            component: () => import("pages/admin/CompanyView.vue"),
            name: "company"
          },
        ]
      },
      {
        path: "tickets",
        children: [
          {
            path: "all",
            component: () => import("pages/user/TicketsListAll.vue"),
            name: "tickets_all",
          },
          {
            path: "processing",
            component: () => import("pages/user/TicketsListProcessing.vue"),
            name: "tickets_processing",
          },
          {
            path: "unload",
            component: () => import("pages/user/TicketsListOnUnload.vue"),
            name: "tickets_unload",
          },
          {
            path: "archive",
            component: () => import("pages/user/TicketsListArchive.vue"),
            name: "tickets_archive",
          },
          {
            path: "authored",
            component: () => import("pages/user/TicketsListAuthored.vue"),
            name: "tickets_authored",
          },
          // {
          //   path: "",
          //   component: () => import("pages/admin/AdminCompanies.vue"),
          //   name: "tickets"
          // },
          {
            path: ":id",
            component: () => import("pages/user/TicketView.vue"),
            name: "ticket"
          },
        ]
      },
      {
        path: "reports",
        children: [
          {
            path: "",
            component: () => import("pages/user/ReportsList.vue"),
            name: "reports"
          },
          {
            path: ":id",
            component: () => import("pages/user/ReportView.vue"),
            name: "report"
          },
        ]
      },
    ],
  },

  // Admin
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "user",
        meta: {
          requiresAdmin: true,
        },
        children: [
          {
            path: "",
            component: () => import("pages/admin/UserList.vue"),
            name: "admin_users"
          },
          {
            path: ":id",
            component: () => import("pages/admin/UserView.vue"),
            name: "admin_user"
          }
        ]
      },
    ],
  },

  {
    path: "/",
    component: () => import("layouts/EmptyLayout.vue"),
    children: [
      {
        path: "/login",
        component: () => import("pages/AccountLogin.vue"),
        name: "login",
        meta: {
          allowUnauthorized: true,
          requiresAuth: false,
        }
      },
      {
        path: "reports/:id/print",
        component: () => import("pages/user/ReportPrintPage.vue"),
        name: "report_print"
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
