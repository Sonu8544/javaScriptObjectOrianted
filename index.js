    class BentoProductInMiniCart {
        constructor() {
            this.miniCart = document.querySelector("mini-cart");
            this.buttons = [];
            this.productsData = [];
            this.cartItems = [];
            this.allBento = [];


            this.onChange = this.onChange.bind(this)


            new IntersectionObserver(this.onLoad.bind(this)).observe(this.miniCart);
            this.addEventListeners();
        }


        addEventListeners() {
            document.addEventListener('cart:update', this.onChange);
            this.onload();
        }


        onLoad(entries, observer) {
            if (!entries[0].isIntersecting) return;
            observer.unobserve(this.miniCart); this.onChange();
        }


        async onChange() {
            try {
                this.productsData = await this.fetchAllProductDetails();
                this.cartItems = await this.fetchAllCartProducts();
                this.buttons = this.miniCart.querySelectorAll(".bentoProductButton");
                this.bentoFilter();
                this.bentoButtonToggle();
                this.getCurrentButtonBentoProduct();
            } catch (err) {
                console.log("Error:", err);
            }
        }


        bentoButtonToggle() {
            this.allBento.forEach(item => {
                this.cartItems.items.forEach(cartProduct => {
                    if (item.variant_id.match(cartProduct.variant_id)) {
                        this.showBentoDetailsBtn(cartProduct.variant_id);
                    }
                });
            });
        }


        getCurrentButtonBentoProduct() {
            this.buttons.forEach(btn => {
                btn.addEventListener("click", this.buttonClick.bind(this));
            });
        }

        buttonClick(e) {
            let currentItem = e.target.dataset.variantId;
            this.allBento.forEach(item => {  // All Bento
                if (item.variant_id.match(currentItem)) {
                    let currentButtonDom = document.querySelector(`[data-variant-id="${item.variant_id}"]`);
                    let existingUl = currentButtonDom.querySelector('.listItem');
                    if (existingUl) {
                        existingUl.remove();

                        currentButtonDom.querySelector(".bentoProductButton").innerHTML = "more &#62;"
                    } else {
                        currentButtonDom.querySelector(".bentoProductButton").innerHTML = "less &#x76";
                        let ulElement = document.createElement('div');
                        ulElement.classList.add("listItem");
                        item.bentoProducts.forEach(bentoProduct => {
                            if (bentoProduct != undefined && bentoProduct != "" && bentoProduct != null) {
                                this.productsData.products.forEach(allProduct => { // All Product's
                                    if (bentoProduct == allProduct.product_id) {

                                        const products = [{ image: allProduct.image, link: allProduct.link, title: allProduct.title, price: allProduct.price }];


                                        products.forEach(product => {
                                            let lItem = document.createElement('li');
                                            lItem.classList.add("bentoAppProduct");


                                            const image = document.createElement('img');
                                            image.src = product.image;
                                            image.alt = product.title;

                                            const title = document.createElement('p');
                                            const link = document.createElement('a');
                                            link.href = product.link;
                                            link.textContent = product.title;
                                            title.appendChild(link);


                                            const price = document.createElement('p');
                                            price.classList.add("bentoProductPrice")
                                            price.textContent = product.price;


                                            lItem.appendChild(image);
                                            lItem.appendChild(title);
                                            lItem.appendChild(price);


                                            ulElement.appendChild(lItem);
                                        });
                                        currentButtonDom.appendChild(ulElement);
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }


        bentoFilter() {
            this.productsData.products.forEach(item => {
                if (item.isBento) {
                    this.allBento.push(item);
                }
            });
        }


        async fetchAllProductDetails() {
            return fetch("https://in.ilemjapan.com/?view=bentoDetails")
                .then(res => res.json())
                .then(data => data);
        }


        async fetchAllCartProducts() {
            return fetch("/cart.js")
                .then(res => res.json())
                .then(data => data);
        }


        showBentoDetailsBtn(getAcvtiveBentoId) {
            let fetchActiveId = getAcvtiveBentoId;
            if (fetchActiveId) {
                $(".mini-cart__navigation li").each(function () {
                    let listIds = $(this).attr("data-variant-id");
                    if (listIds == fetchActiveId) {
                        $(this).find("button.bentoProductButton").show();
                    }
                });
            }
        }
    }


new BentoProductInMiniCart();
