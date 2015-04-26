
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
			moreButton = document.querySelector('.js-moreButton');

	function setup () {

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
		})
	}

	function more () {
		url = url.replace('page-' + pagination.page, 'page-' + ++pagination.page)
		getData(true)
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
		var currentProducts = productsContainer.querySelectorAll('.product')
		for (var i = 0; i < currentProducts.length; i++)
			currentProducts[i].remove()
		add(products)
	}

	function add (products) {
		for (var i = 0; i < products.length; i++) {
			var product = makeProduct(productTemplate, products[i])
			salvattore['append_elements'](productsContainer, [product])

			makeObject(product, products[i])
		}
	}

	function getData(isAdd){
		url = url.replace('products' , 'search/products')
		console.log('url: ', url)
		console.log('idUser: ', idUser)

		$.post( url, {idUser: idUser}, function( data ) {
			console.log('data: ', data)

			url = data.url
			if(isAdd) add(data.products)
			else {
				window.history.pushState({}, "", url)
				render(data.products)
			}
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