import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { MaterializeService } from 'src/app/shared/services/materialize.service';
import { Category } from 'src/app/shared/interfaces/category.model';
import { MaterialInstance } from 'src/app/shared/interfaces/material-instance.model';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('inputUploadFile') inputUploadFileRef: ElementRef;
  @ViewChild('modalWindow') modalWindow: ElementRef;

  form: FormGroup;
  isNew = true;
  fileImage: File;
  imagePreview = '';
  currentCategory: Category;
  currentCategory$: Observable<any>;
  modal: MaterialInstance;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService,
    private materializeService: MaterializeService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });
    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params.id) {
            this.isNew = false;
            return this.categoriesService.getCategoryById(params.id);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(
        (category: Category) => {
          if (category) {
            this.currentCategory = category;
            this.form.patchValue({ name: category.name });
            this.imagePreview = category.imageSrc;
            this.materializeService.updateTextInput();
          }
          this.form.enable();
        },
        error => this.materializeService.toast(error.error.message)
      );
  }

  triggerClick() {
    this.inputUploadFileRef.nativeElement.click();
  }

  onFileUpload(event) {
    this.fileImage = event.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(this.fileImage);
  }

  onSubmit() {
    this.form.disable();

    if (this.isNew) {
      this.currentCategory$ = this.categoriesService.createCategory(
        this.form.value.name,
        this.fileImage
      );
    } else {
      this.currentCategory$ = this.categoriesService.updateCategory(
        this.currentCategory._id,
        this.form.value.name,
        this.fileImage
      );
    }

    this.currentCategory$.subscribe(
      category => {
        this.currentCategory = category;
        this.materializeService.toast('Изменения сохранены');
        this.form.enable();
      },
      error => {
        this.materializeService.toast(error.error.message);
        this.form.enable();
      }
    );
  }

  openConfirmationCategory() {
    this.modal.open();
  }

  deleteCategoryCancel() {
    this.modal.close();
  }

  deleteCategoryDone() {
    this.categoriesService
      .deleteCategory(this.currentCategory._id)
      .subscribe(
        response => this.materializeService.toast(response.message),
        error => this.materializeService.toast(error.error.message),
        () => this.router.navigate(['/categories'])
      );
  }

  ngAfterViewInit() {
    this.modal = this.materializeService.initializeModal(this.modalWindow);
  }

  ngOnDestroy() {
    this.modal.destroy();
  }
}
