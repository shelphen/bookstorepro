import { Routes } from '@angular/router';
import { LoginGuard } from '../login/guard.service'; 
import { LevelListComponent } from './level-list.component';
import { LevelAddComponent } from './level-add.component';
import { LevelComponent } from './level.component';
 
export const LevelRoutes: Routes = [
    {
        path: 'levels',
        component: LevelComponent,
        canActivate:[LoginGuard],
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            { path: 'list', component: LevelListComponent },
            { path: 'add/:id', component: LevelAddComponent }
        ]
        
    }
];