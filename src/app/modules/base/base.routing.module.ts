// Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BaseLayoutComponent } from "./pages/base-layout.component";
import { CmmAuthGuard } from "src/app/common/guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    canActivate: [CmmAuthGuard],
    children: [
      {
        path: "",
        redirectTo: "testmodule",
        pathMatch: "full",
      },
      {
        path: "testmodule",
        loadChildren: () =>
          import("../testmodule/test.module").then(
            m => m.TestModule
          ),
      },
      {
        path: "users",
        loadChildren: () =>
          import("../users/users.module").then(
            m => m.UsersModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CmmAuthGuard],
})
export class BaseRoutingModule {}
