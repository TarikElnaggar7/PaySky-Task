import { Component, OnInit } from "@angular/core";
import { CategoryService } from "../services/category.service";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
})
export class CategoriesComponent implements OnInit {
  categories: string[] = [];
  newCategory: string = "";

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService
      .getCategories()
      .subscribe((categories) => (this.categories = categories));
  }

  addCategory() {
    if (this.newCategory.trim()) {
      this.categoryService.addCategory(this.newCategory).subscribe(() => {
        this.categories = [...this.categories];
        this.newCategory = "";
      });
    }
  }

  deleteCategory(category: string) {
    if (confirm("Are you sure you want to delete this category?")) {
      this.categoryService.deleteCategory(category).subscribe(() => {
        this.categories = this.categories.filter((c) => c !== category);
      });
    }
  }
}
