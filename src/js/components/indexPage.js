import {store} from "../store/store"
import {
    setCurrentSortCategory, 
    setCurrentGoodCategory,
    setSizeOfGood,
    setDoughTypeOfGood,
    incrementAddedCount
} from "../store/indexPageReducer"

class IndexPageAPI {
    constructor(store) {
        this.dispatch = store.dispatch.bind(store)
        this.getPageState = () => {
            return store.getState().indexPageReducer
        }
    }
    setCategorySortOpenStatus() {
        const rootElement = document.querySelector(".category__sort")

        rootElement.addEventListener("mouseover", () => {
            rootElement.classList.add("category__sort_open")
        })
        rootElement.addEventListener("mouseout", () => {
            rootElement.classList.remove("category__sort_open")
        })
    }
    setCurrentSortCategory() {
        const rootElement = document.querySelector(".category__sortItems")
        const state = this.getPageState()

        // Create a new sort category el
        state.sortCategoryList.forEach(v => {
            const el = document.createElement("span")
            el.classList.add("category__sortItem")
            el.dataset.value = v
            el.dataset.type = "sortCategory"
            el.innerText = v

            rootElement.append(el)
        })

        rootElement.addEventListener("click", e => {
            if (e.target.dataset.type === "sortCategory") {
                this.dispatch(setCurrentSortCategory(e.target.dataset.value))
            }
        })
    }
    setCurrentGoodCategory() {
        const state = this.getPageState()
        const categoryItemsEl = document.querySelector(".category__items")

        state.goodsCategoryList.forEach(v => {
            const el = document.createElement("button")
            el.classList.add("category__item")
            el.innerText = v
            el.dataset.categoryType = v

            categoryItemsEl.append(el)
        })

        categoryItemsEl.addEventListener("click", e => {
            if (e.target.className === "category__item") {
                this.dispatch(setCurrentGoodCategory(e.target.dataset.categoryType))
            }
        })
    }

    createGoodItem(goodInfo) {
        const rootEl = document.createElement("div")
        const imgEl = document.createElement("img")
        const titleEl = document.createElement("p")
        const itemOptionsEl = document.createElement("div")
        const itemOptionBlockEl1 = document.createElement("div")
        const itemOptionBlockEl2 = document.createElement("div")
        const buyBlockEl = document.createElement("div")
        const priceEl = document.createElement("p")
        const buyBtnEl = document.createElement("button")
        let goodPrice = 0

        rootEl.classList.add("goodsList__item")
        rootEl.dataset.goodId = goodInfo.id

        imgEl.setAttribute("src", goodInfo.imgPath)
        imgEl.classList.add("goodsList__itemImg")
        imgEl.setAttribute("alt", "pizza photo")

        titleEl.classList.add("goodsList__itemTitle")
        titleEl.innerText = goodInfo.name

        itemOptionsEl.classList.add("goodsList__itemOptions")

        itemOptionBlockEl1.classList.add("goodsList__itemOptionsBlock") // for dough type
       
        itemOptionBlockEl2.classList.add("goodsList__itemOptionsBlock") // for good sizes

        buyBlockEl.classList.add("goodsList__itemBuyBlock")
        priceEl.classList.add("goodsList__itemPrice")
        buyBtnEl.classList.add("goodsList__itemButton")

        goodInfo.doughTypes.forEach(v => {
            const el = document.createElement("span")
            el.innerText = v.type
            el.classList.add("goodsList__itemOptionText")
            el.dataset.itemId = v.id
            el.dataset.type = "dough"

            if (v.id === goodInfo.currentDoughTypeId) {
                el.classList.add("goodsList__itemOptionText_selected")
                goodPrice += v.price
            }
            itemOptionBlockEl1.append(el)
        })
        goodInfo.sizes.forEach(v => {
            const el = document.createElement("span")
            el.innerText = v.size + "cm"
            el.classList.add("goodsList__itemOptionText")
            el.dataset.itemId = v.id
            el.dataset.type = "size"

            if (v.id === goodInfo.currentSizeId) {
                el.classList.add("goodsList__itemOptionText_selected")
                goodPrice += v.price
            }
            itemOptionBlockEl2.append(el)
        })
        itemOptionBlockEl1.addEventListener("click", e => {
            if (e.target.dataset.type === "dough") {
                this.dispatch(setDoughTypeOfGood({
                    goodId: goodInfo.id, 
                    doughId: +(e.target.dataset.itemId)
                }))
            }
        })
        itemOptionBlockEl2.addEventListener("click", e => {
            if (e.target.dataset.type === "size") {
                this.dispatch(setSizeOfGood({
                    goodId: goodInfo.id, 
                    sizeId: +(e.target.dataset.itemId)
                }))
            }
        })

        buyBtnEl.addEventListener("click", e => {
            this.dispatch(incrementAddedCount({
                goodId: goodInfo.id,
                goodPrice
            }))
        })

        itemOptionsEl.append(itemOptionBlockEl1, itemOptionBlockEl2)

        priceEl.innerText = goodPrice + "P"
        buyBtnEl.innerText = goodInfo.addedCount ? 
        "Добавить " + goodInfo.addedCount :
        "Добавить"

        buyBlockEl.append(priceEl, buyBtnEl)

        // add all elements to root el
        rootEl.append(
            imgEl,
            titleEl,
            itemOptionsEl,
            buyBlockEl
        )
        return rootEl
    }
    addEventHandlers() {
        this.setCategorySortOpenStatus()
        this.setCurrentSortCategory()
        this.setCurrentGoodCategory()
    }
    render() {
        const state = this.getPageState()

        // set header payment info
        const headerPaymentAmountEl = document.querySelector(".header__paymentInfoAmount")
        const headerPaymentCountEl = document.querySelector(".header__paymentInfoPizzaCount")

        headerPaymentAmountEl.innerText = state.totalSumOfGoodsPrice + "P"
        headerPaymentCountEl.innerText = state.allAddedGoodCount
        // ----

        // Setting active sort category
        const sortCategoriesElementsEl = document.querySelectorAll(".category__sortItem")
        const sortCategoryTextElementEl = document.querySelector(".category__sortActiveItem")

        sortCategoriesElementsEl.forEach(v => {
            if (v.dataset.value === state.currentSortCategory) {
                v.classList.add("category__sortItem_active")
            } else {
                v.classList.remove("category__sortItem_active")
            }
        })
        sortCategoryTextElementEl.innerText = state.currentSortCategory
        // -----

        // set current good category
        const categoryItemsEl = document.querySelectorAll(".category__item")
        categoryItemsEl.forEach(v => {
            if (v.dataset.categoryType === state.currentGoodsCategory) {
                v.classList.add("category__item_active")
            } else {
                v.classList.remove("category__item_active")
            }
        })
        // ---- 

        // set good items
        const goodsItemsEl = document.querySelector(".goodsList__items")

        goodsItemsEl.innerHTML = "" // reset old good items
            
        if (state.currentGoodsCategory === "все") {

        }

        const currentGoodsItem = state.goodsList.filter(v => {
            if (v.category.includes(state.currentGoodsCategory)) {
                const el = this.createGoodItem(v)
                goodsItemsEl.append(el)

                return true // its did for checking epmty arr or not
            }
        })


        if (!currentGoodsItem.length) {
            const el = document.createElement("p")
            goodsItemsEl.classList.add("goodsList__items_notFound")

            el.className = "goodsList__itemsNotFound"
            el.innerText = "К сожалению пиццы с категорией: " + 
            state.currentGoodsCategory + " не найдено."
            goodsItemsEl.append(el)
        } else {
            goodsItemsEl.classList.remove("goodsList__items_notFound")
        }
        // -----
    }
}
const indexPage = new IndexPageAPI(store)

// Init event listeners and render current state
indexPage.addEventHandlers()
indexPage.render()

store.subscribe(indexPage.render.bind(indexPage))