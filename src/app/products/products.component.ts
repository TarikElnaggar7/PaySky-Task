import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ProductService, Product } from "../services/product.service";
import { ProductDetailComponent } from "./product-detail/product-detail.component";
import { ProductFormComponent } from "./product-form/product-form.component";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  displayedColumns: string[] = ["id", "title", "price", "category", "actions"];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products) => {
      this.products = [...products];
    });
  }

  openProductDetail(product: Product) {
    this.dialog.open(ProductDetailComponent, {
      width: "400px",
      data: product,
    });
  }

  openProductForm(product?: Product) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: "400px",
      data: { product: product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (product) {
          const index = this.products.findIndex((p) => p.id === result.id);
          if (index !== -1) {
            this.products[index] = result;
          }
        } else {
          this.products.push(result);
        }
        this.products = [...this.products];
      }
    });
  }

  deleteProduct(id: number) {
    if (confirm("Are you sure you want to delete this product?")) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.products = this.products.filter((p) => p.id !== id);
      });
    }
  }
}
