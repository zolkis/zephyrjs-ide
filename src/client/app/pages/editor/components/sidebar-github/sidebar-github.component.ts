// Core
import {
    Component,
    ElementRef,
    EventEmitter,
    Output,
    ViewChild
} from '@angular/core';

import { SidebarGitHubService, WIZARD_STEP } from './sidebar-github.service';
import { GitHubRepoService, GitHubUserService } from './sidebar-github.api-services';


declare var $: any;


@Component({
    moduleId: module.id,
    selector: 'sd-sidebar-github',
    templateUrl: 'sidebar-github.component.html',
    styleUrls: ['sidebar-github.component.css']
})
export class SidebarGitHubComponent {
    // tslint:disable-next-line:no-unused-locals (used in template)
    public wizardStepEnum = WIZARD_STEP;

    @Output()
    private onFileSelected = new EventEmitter();


    public constructor(
        private repoService: GitHubRepoService,
        private userService: GitHubUserService,
        public gitHubService: SidebarGitHubService) { }


    // tslint:disable-next-line:no-unused-locals
    public mayLogin() {
        return (
            this.gitHubService.wizardStep === WIZARD_STEP.LOGIN &&
            this.gitHubService.data.user.token.length > 0
        );
    }

    // tslint:disable-next-line:no-unused-locals
    public onLoginClicked() {
        let onError = (error: any) => {
            if (error.status === 401) {
                this.reset();
            } else {
                console.error(error.message);
            }
            this.gitHubService.data.user.ui.hasError = true;
        };

        let getRepos = (page: number = 1) => {
            this.userService.getRepos({page: page}).$observable.subscribe(
                (repos: any[]) => {
                    this.gitHubService.data.repos.objects =
                        this.gitHubService.data.repos.objects.concat(repos.sort((a: any, b: any) => {
                            if (a.full_name.toLowerCase() < b.full_name.toLowerCase()) return -1;
                            if (a.full_name.toLowerCase() > b.full_name.toLowerCase()) return 1;
                            return 0;
                        }));

                    if (repos.length > 0) {
                        getRepos(page + 1);
                    } else {
                        // Done!
                        this.gitHubService.wizardStep = WIZARD_STEP.CHOOSE_FILE;
                    }
                },
                (error: any) => { onError(error); }
            );
        };

        this.gitHubService.wizardStep = WIZARD_STEP.LOGGING_IN;
        setTimeout(() => {
            this.userService.setToken(this.gitHubService.data.user.token);
            this.repoService.setToken(this.gitHubService.data.user.token);

            this.userService.getUser().$observable.subscribe(
                (user: any) => {
                    this.gitHubService.data.user.object = user;
                    getRepos();
                },
                (error: any) => { onError(error); }
            );
        }, 0);
    }

    // tslint:disable-next-line:no-unused-locals
    public onRepoChanged(name: string) {
        let getRepoByName = (name: string): any => {
            return this.gitHubService.data.repos.objects.find((repo: any) => {
                return repo.full_name === name;
            });
        };
        let repo = getRepoByName(name);

        this.resetBranches();
        this.resetFiles();

        this.gitHubService.data.repos.current = repo;
        if (repo !== null) {
            this.gitHubService.data.branches.ui.loading = true;
            this.repoService.getBranches({
                owner: this.gitHubService.data.repos.current.owner.login,
                repo: this.gitHubService.data.repos.current.name
            }).$observable.subscribe(
                (branches: any[]) => {
                    this.gitHubService.data.branches.ui.loading = false;
                    this.gitHubService.data.branches.objects = branches;
                }
            );
        }
    }

    // tslint:disable-next-line:no-unused-locals
    public onBranchChanged(name: string) {
        let getBranchByName = (name: string): any => {
            return this.gitHubService.data.branches.objects.find((branch: any) => {
                return branch.name === name;
            });
        };

        let repo = this.gitHubService.data.repos.current;
        let branch = getBranchByName(name);

        this.resetFiles();

        if (repo !== null && branch !== null) {
            this.gitHubService.data.files.rootSha = branch.commit.sha;
            this.fetchFiles(branch.commit.sha);
        }
    }

    public fetchFiles(sha: string) {
        this.gitHubService.data.files.ui.loading = true;
        this.repoService.getTree({
            owner: this.gitHubService.data.repos.current.owner.login,
            repo: this.gitHubService.data.repos.current.name,
            sha: sha
        }).$observable.subscribe(
            (data: any) => {
                this.gitHubService.data.files.ui.loading = false;
                this.gitHubService.data.files.currentSha = sha;
                this.gitHubService.data.files.objects = data.tree.sort((a: any, b: any) => {
                    // Directories first, then names.
                    if (a.type === b.type) {
                        if (a.path.toLowerCase() < b.path.toLowerCase()) return -1;
                        if (a.path.toLowerCase() > b.path.toLowerCase()) return 1;
                        return 0;
                    }

                    if (a.type === 'tree') return -1;
                    return 1;
                });
            }
        );

        return false;
    }

    // tslint:disable-next-line:no-unused-locals
    public onFileClicked(file: any) {
        if (file.type === 'tree') {
            this.fetchFiles(file.sha);
        } else {
            let repo = this.gitHubService.data.repos.current;

            this.gitHubService.wizardStep = WIZARD_STEP.DOWNLOADING;
            this.repoService.getBlob({
                owner: repo.owner.login,
                repo: repo.name,
                sha: file.sha
            }).$observable.subscribe(
                (response: any) => {
            this.gitHubService.wizardStep = WIZARD_STEP.DOWNLOADING;
                    this.onFileSelected.emit({
                        filename: file.path,
                        contents: atob(response.content)
                    });
                    this.gitHubService.wizardStep = WIZARD_STEP.CHOOSE_FILE;
                }
            );

        }

        return false;
    }

    // tslint:disable-next-line:no-unused-locals
    public onLogoutClicked() {
        this.reset();
    }


    ///////////////////////////////////////////////////////////////////////////


    private resetUI() {
        this.gitHubService.wizardStep = WIZARD_STEP.LOGIN;
    }

    private resetUser() {
        this.gitHubService.data.user.token = '';
        this.gitHubService.data.user.object = null;
        this.gitHubService.data.user.ui.hasError = false;
    }

    private resetGists() {
        this.gitHubService.data.gists.objects = [];
        this.gitHubService.data.gists.selected = null;
    }

    private resetRepos() {
        this.gitHubService.data.repos.objects = [];
        this.gitHubService.data.repos.selected = null;
        this.gitHubService.data.repos.current = null;
    }

    private resetBranches() {
        this.gitHubService.data.branches.objects = [];
        this.gitHubService.data.branches.selected = null;
        this.gitHubService.data.branches.ui.loading = false;
    }

    private resetFiles() {
        this.gitHubService.data.files.objects = [];
        this.gitHubService.data.files.currentSha = null;
        this.gitHubService.data.files.rootSha = null;
        this.gitHubService.data.files.ui.loading = false;
    }

    private reset() {
        this.resetUI();
        this.resetUser();
        this.resetGists();
        this.resetRepos();
        this.resetBranches();
        this.resetFiles();
    }
}
