import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'https://fakestoreapi.com/products/categories';
  private categoriesSubject = new BehaviorSubject<string[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  private loadCategories() {
    this.http.get<string[]>(this.apiUrl).subscribe(
      categories => this.categoriesSubject.next(categories)
    );
  }

  getCategories(): Observable<string[]> {
    return this.categories$;
  }

  addCategory(category: string): Observable<string> {
    return new Observable(observer => {
      const currentCategories = this.categoriesSubject.value;
      const updatedCategories = [...currentCategories, category];
      this.categoriesSubject.next(updatedCategories);
      observer.next(category);
      observer.complete();
    });
  }

  deleteCategory(category: string): Observable<any> {
    return new Observable(observer => {
      const currentCategories = this.categoriesSubject.value;
      const updatedCategories = currentCategories.filter(c => c !== category);
      this.categoriesSubject.next(updatedCategories);
      observer.next({});
      observer.complete();
    });
  }
}