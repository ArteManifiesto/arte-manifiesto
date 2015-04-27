
function Products (data) {
	
	window.history.pushState({}, "", url)

	var	makeObject = data.makeObject;

	var productsContainer = document.querySelector('.products'),
			productTemplate = _.template( $( "#product-template" ).html() );

	var category = 'all',
			orderValue = 'popularity',
			timeValue = 'week',
			page = 1;

	var idUser = user.id || 0

	var categoryList = document.querySelectorAll('.js-category'),
			orderList = document.querySelectorAll('.js-order'),
			timeList = document.querySelectorAll('.js-time'),
			moreButton = document.querySelector('.js-moreButton'),
			featuredButton = document.querySelector('input[name="question"]');
			console.log('featuredButton: ', featuredButton)

	var looking = false
	var scrollMode = false

	var loading = document.querySelector('.loading')
	var moreContainer = document.querySelector('.more')

	function setup () {

		featuredButton.addEventListener('change', function () {
			// console.log('change')
			// console.log(featuredButton.checked)
			changeFeatured(featuredButton.checked)
		})

		for (var i = 0; i < categoryList.length; i++)
			categoryList[i].addEventListener('click', function () {
				changeCategory(this.getAttribute("data-value"))
			})

		for (var i = 0; i < orderList.length; i++)
			orderList[i].addEventListener('click', function () {
				changeOrder(this.getAttribute("data-value"))
			})

		for (var i = 0; i < timeList.length; i++)
			timeList[i].addEventListener('click', function () {
				changeTime(this.getAttribute("data-value"))
			})

		moreButton.addEventListener('click', function () {
			more()
			moreContainer.classList.add('hide')
			scrollMode = true
		})

		window.onscroll = function(ev) {
			console.log('onscroll!')
			if(looking) return
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
				console.log('bottom!')
				if(scrollMode) more()
			}
		}
	}

	function more () {
		
		if(pagination.page == pagination.pages) return

		url = url.replace('page-' + pagination.page, 'page-' + ++pagination.page)
		getData(true)
	}

	function changeFeatured (featuredValue) {

		var featured = getUrlParameter('featured')
    console.log('featured: ', featured)
		
		if(featured == undefined) {
			url = url + '&featured'
		} else {
			// console.log('holi!')
			if(!featuredValue)
				url = url.replace("&featured=", "")
		}
		// console.log(url)
		url = url.replace('page-' + pagination.page, 'page-1')
		getData(false)


		// url = url.replace(featured, featuredValue)
		// console.log(url)
		// url = url.replace('page-' + pagination.page, 'page-1')
		// console.log(url)

		// getData(false)
	}

	function changeCategory (value) {
		category = value
		var currentCategory = url.split('/')[5]
		url =	url.replace('type/'+currentCategory, 'type/'+category)
		url = url.replace('page-' + pagination.page, 'page-1')
		getData(false)
	}

	function changePrice (values) {
		// console.log('changePrice: ', values)

    var lo_p = getUrlParameter('lo_p')
    // console.log('lo_p: ', lo_p)

		url = url.replace('lo_p=' + lo_p, 'lo_p=' + values[0])
		url = url.replace('page-' + pagination.page, 'page-1')

    var hi_p = getUrlParameter('hi_p')
    // console.log('hi_p: ', hi_p)

		url = url.replace('hi_p=' + hi_p, 'hi_p=' + values[1])
		url = url.replace('page-' + pagination.page, 'page-1')

		getData(false)
	}

	function changeOrder(value) {
		orderValue = value

		var order = getUrlParameter('order')
    console.log('order: ', order)
		
		url = url.replace(order, orderValue)
		url = url.replace('page-' + pagination.page, 'page-1')

		getData(false)
	}

	function changeTime (value) {
		timeValue = value
		var time = getUrlParameter('time');
		if (time != undefined)
			url = url.replace(time, timeValue);
		else
			url += '&time='+timeValue;
		url = url.replace('page-' + pagination.page, 'page-1')
		getData(false)
	}

	function render (products) {
		var currentProducts = productsContainer.querySelectorAll('.product-wrapper')
		for (var i = 0; i < currentProducts.length; i++)
			currentProducts[i].remove()
		add(products)

		if(pagination.page < pagination.pages){
			moreContainer.classList.remove('hide')
			scrollMode = false
		} else {
			moreContainer.classList.add('hide')
		}
	}

	function add (products) {
		for (var i = 0; i < products.length; i++) {
			var product = makeProduct(productTemplate, products[i])
			// salvattore['append_elements'](productsContainer, [product])
			productsContainer.appendChild(product)

			makeObject(product, products[i])
		}
	}

	function getData(isAdd){
		url = url.replace('products' , 'search/products')
		// console.log('idUser: ', idUser)

		looking = true
		loading.style.display = 'block'
		
		console.log('url: ', url)
		$.post( url, {idUser: idUser}, function( data ) {
			console.log('data: ', data)

			loading.style.display = 'none'

			looking = false

			url = data.url

			// console.log('data.pagination: ', data.pagination)
			pagination = data.pagination

			if(isAdd) add(data.products)
			else {
				window.history.pushState({}, "", url)
				render(data.products)
			}

			// url = data.url
			// if(isAdd) add(data.products)
			// else {
			// 	window.history.pushState({}, "", url)
			// 	render(data.products)
			// }
		})
	}
	
	function getUrlParameter(sParam) {
		var sPageURL = window.location.search.substring(1)
		var sURLVariables = sPageURL.split('&')
		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=')
			if (sParameterName[0] == sParam)
				return sParameterName[1]
		}
	}

	setup()

	return {
		changePrice: changePrice
	}
}

function makeProduct (productTemplate, productData) {
	var productString = productTemplate(productData)
	var div = document.createElement('div')
	div.innerHTML = productString
	return div.children[0]
}