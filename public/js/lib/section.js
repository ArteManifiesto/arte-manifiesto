function Section(data) {

    var path = data.path

    var container = document.querySelector('.' + data.containerClass)
    var template = _.template($("#" + data.templateId).html())

    var mainFilter = data.mainFilter
    var parameters = data.parameters

    var moreSection = document.querySelector('.more')
    var moreButton = moreSection.querySelector('.button-solid')

    var emptyResult = document.querySelector('.empty-result')
    var loading = document.querySelector('.loading')

    var scrollMode = false

    var idUser = user.id || 0

    var wrapper = document.querySelector('.main-wrapper')

    var searchers = data.searchers

    var navigation = document.querySelector('.section__navigation')
    var navigationText = document.querySelector('.js-navigation-text')

    var createObject = data.createObject

    var filterLeftButton = document.querySelectorAll('.button-filter')[0]
    var filterRightButton = document.querySelectorAll('.button-filter')[1]
    // console.log('filterLeftButton: ', filterLeftButton)
    // console.log('filterRightButton: ', filterRightButton)

    var filterLeft = document.querySelectorAll('.section__workspace__filter')[0]
    var filterRight = document.querySelectorAll('.section__workspace__filter')[1]
    // console.log('filterLeft: ', filterLeft)
    // console.log('filterRight: ', filterRight)
    var elementsCotainer = document.querySelector('.section__workspace__elements')

    var leftVisible = false
    var rightVisible = false

    function setup() {

        filterLeftButton.addEventListener('click', function () {
            if (leftVisible) {
                filterLeft.classList.remove('visible')
                elementsCotainer.classList.remove('moveLeft')
                container.classList.remove('moveLeft')
                filterLeftButton.classList.remove('active')
            }
            else {
                filterLeft.classList.add('visible')
                elementsCotainer.classList.add('moveLeft')
                container.classList.add('moveLeft')
                filterLeftButton.classList.add('active')
            }
            leftVisible = leftVisible ? false : true
        })
        filterRightButton.addEventListener('click', function () {
            if (rightVisible) {
                filterRight.classList.remove('visible')
                elementsCotainer.classList.remove('moveRight')
                container.classList.remove('moveRight')
                filterRightButton.classList.remove('active')
            }
            else {
                filterRight.classList.add('visible')
                elementsCotainer.classList.add('moveRight')
                container.classList.add('moveRight')
                filterRightButton.classList.add('active')
            }
            rightVisible = rightVisible ? false : true
        })

        var searchEl = document.querySelector('.search')
        var search = new Search(searchEl)

        searchEl.addEventListener('search', function () {
            changeSearch(search.values().text, search.values().url)
            // navigationText.innerHTML = search.values().text
            // navigation.classList.add('visible')
        })

        window.history.pushState({}, "", url)

        window.onscroll = function () {
            if ((window.innerHeight + window.scrollY) >= wrapper.offsetHeight)
                if (scrollMode) {
                    console.log('scroll end!')
                    nextPage()
                }
        }

        moreButton.addEventListener('click', initScroll)

        var mainFilters = document.querySelectorAll('.' + mainFilter.name)

        new Filter(mainFilters)

        for (var i = mainFilters.length - 1; i >= 0; i--) {

            mainFilters[i].addEventListener('click', function () {
                changeMainFilter(this.getAttribute('data-value'))
            })
        }

        for (var i = parameters.length - 1; i >= 0; i--) {
            var parametersFilter = document.querySelectorAll('.' + parameters[i].name)
            setupParameters(parametersFilter, parameters[i].url)

            new Filter(parametersFilter)
        }
    }

    function setupParameters(parameters, partialUrl) {
        for (var i = parameters.length - 1; i >= 0; i--) {
            parameters[i].addEventListener('click', function () {
                changeParameter(this.getAttribute('data-value'), partialUrl)
            })
        }
    }

    function changeParameter(value, partialUrl) {

        var currentValue = getUrlParameter(partialUrl)

        if (currentValue != undefined)
            url = url.replace(currentValue, value)
        else
            url += '&' + partialUrl + '=' + value
        url = url.replace('page-' + pagination.page, 'page-1')
        url = url.replace(path, 'search/' + path)

        if (path != 'works') resetElements()
        else resetWorks()

        console.log('url: ', url)
        getElements(url, function (elements) {
            console.log('elements: ', elements)
            renderElements(elements)
        })
    }

    function changeSearch(value, partialUrl) {

        for (var i = searchers.length - 1; i >= 0; i--) {
            var val = getUrlParameter(searchers[i]);
            if (val != undefined)
                url = url.replace('&' + searchers[i] + '=' + val, '')
        }

        if (value.length > 0)
            url += '&' + partialUrl + '=' + value

        url = url.replace('page-' + pagination.page, 'page-1')
        url = url.replace(path, 'search/' + path)

        resetElements()

        getElements(url, function (elements) {
            renderElements(elements)
        })

    }

    function changeMainFilter(value) {
        // console.log('changeMainFilter: ', value)

        var currentValue = url.split('/')[5]
        if (path == 'users') url = url.replace('specialty/' + currentValue, 'specialty/' + value)
        if (path == 'products') url = url.replace('type/' + currentValue, 'type/' + value)
        if (path == 'works') url = url.replace('category/' + currentValue, 'category/' + value)
        url = url.replace('page-' + pagination.page, 'page-1')
        url = url.replace(path, 'search/' + path)

        if (path != 'works') resetElements()
        else resetWorks()

        console.log('url: ', url)
        getElements(url, function (elements) {
            console.log('elements: ', elements)
            renderElements(elements)
        })
    }

    function resetElements() {
        container.innerHTML = ""
        emptyResult.classList.remove('visible')
        moreSection.classList.add('hidden')
        scrollMode = false
    }

    function resetWorks() {
        var worksEls = container.querySelectorAll('.work')

        for (var i = worksEls.length - 1; i >= 0; i--) {
            // console.log('worksEl: ', worksEls[i])
            worksEls[i].remove()
        }

        emptyResult.classList.remove('visible')
        moreSection.classList.add('hidden')
        scrollMode = false
    }

    function nextPage(callback) {

        if (pagination.page == pagination.pages) return

        url = url.replace(path, 'search/' + path)
        url = url.replace('page-' + pagination.page, 'page-' + ++pagination.page)

        scrollMode = false
        getElements(url, function (elements) {
            addElements(elements)
            if (callback) callback()
            scrollMode = true
        })
    }

    function getElements(newUrl, callback) {

        loading.classList.add('visible')

        $.post(newUrl, {idUser: idUser}, function (data) {
            loading.classList.remove('visible')

            url = data.url
            window.history.pushState({}, "", url)

            pagination = data.pagination
            callback(data[path])
        })
    }

    function initScroll() {
        moreSection.classList.add('hidden')
        nextPage(function () {
            scrollMode = true
        })
    }

    function addElements(elements) {
        console.log('addElements: ', elements)
        for (var i = 0; i < elements.length; i++) {
            var object = makeObject(template, elements[i])
            createObject(object, elements[i])
            console.log(object)

            if (path != 'works')
                container.appendChild(object)
            else
                salvattore['append_elements'](container, [object])
        }
    }

    function renderElements(elements) {
        if (elements.length != 0) {
            addElements(elements)
            if (pagination.page < pagination.pages)
                moreSection.classList.remove('hidden')
            return
        }
        emptyResult.classList.add('visible')
    }

    setup()
}

function makeObject(template, data) {
    var objectString = template(data)
    var div = document.createElement('div')
    div.innerHTML = objectString
    return div.children[0]
}

function getUrlParameter(sParam) {
    // var sPageURL = window.location.search.substring(1)
    var sPageURL = window.location.search.substring(1)
    var sURLVariables = sPageURL.split('&')
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=')
        if (sParameterName[0] == sParam)
            return sParameterName[1]
    }
}


function Filter (filters) {

    var current = 0

    for (var i = 0; i < filters.length; i++) {
        var filter = filters[i]

        filter.setAttribute('index', i)

        filter.addEventListener('click', function () {
            var index = this.getAttribute('index')
            console.log('index', index)

            filters[current].classList.remove('selected')
            filters[index].classList.add('selected')
            current = index

        })
    }
}