import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Product, ProductService } from "../../services/product.service";
import { CategoryService } from "../../services/category.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-product-form",
  templateUrl: "./product-form.component.html",
  styleUrls: ["./product-form.component.scss"],
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  editMode: boolean;
  categories$: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    private productService: ProductService,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product }
  ) {
    this.editMode = !!data.product;
    this.productForm = this.fb.group({
      title: ["", Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ["", Validators.required],
      category: ["", Validators.required],
      image: ["", Validators.required],
    });
    this.categories$ = this.categoryService.getCategories();
  }

  ngOnInit() {
    if (this.editMode) {
      this.productForm.patchValue(this.data.product);
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      if (this.editMode) {
        product.id = this.data.product.id;
        this.productService
          .updateProduct(product)
          .subscribe((updatedProduct) => this.dialogRef.close(updatedProduct));
      } else {
        this.productService
          .addProduct(product)
          .subscribe((newProduct) => this.dialogRef.close(newProduct));
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
