import { Component, OnInit } from '@angular/core';
import { Product } from '../product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-edit-product',
    templateUrl: './edit-product.component.html',
    styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
    product: Product;
    keypress: any;
    fileData: File = null;
    previewUrl: any = null;
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;
    product_id: string = "";
    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private router: Router,
        private toastr: ToastrService
    ) { }


    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.product_id = id;
        this.productService.getProductById(id).subscribe(
            next => {
                this.product = next.data;
                console.log(this.product);
                // this.postForm.patchValue(this.product);
            }, error => {
                console.log(error);
                this.product = null;
            }
        );
    }
    fileProgress(fileInput: any) {
        this.fileData = <File>fileInput.target.files[0];
        this.preview();
    }

    preview() {
        // Show preview 
        var mimeType = this.fileData.type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }

        var reader = new FileReader();
        reader.readAsDataURL(this.fileData);
        reader.onload = (_event) => {
            this.previewUrl = reader.result;
        }
        const formData = new FormData();
        formData.append('file', this.fileData);
    }
    onSubmit(data) {
        if (data.invalid) return alert("error validate");
        let check_user = localStorage.getItem("currentUser");
        let user = JSON.parse(check_user);
        let { user_info } = user;
        let { value } = data;
        value.owner_info = {
            owner_type: 1,
            owner_id: user_info.uid
        }
        value.properties = {
            address: data.value.address,
            direction_balcony: data.value.direction_balcony,
            type_of_post: data.value.type_of_post,
            price: data.value.price,
            acreage: data.value.acreage,
            category: data.value.category,
            facade: data.value.facade,
            road_wide: data.value.road_wide
        }
        value.location = {
            latitude: data.value.latitude,
            longitude: data.value.longitude
        }
        value.images = [
            data.value.images,
        ]
        let req = {
            product_id: this.product_id,
            data: value
        }
        this.productService.updateProduct(req).subscribe((res) => {
            if (res.success) {
                this.toastr.success('Success', 'Cập nhật thành công!');
            } else {
                this.toastr.error('Error', 'Cập nhật thất bại!');
            }
        },
            error => console.log(error)
        );
    }
}
