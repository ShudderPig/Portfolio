const lps = {
    init: () => {
        if (window.location.href.includes('.html')) {
            window.location.href = '/'
        }

        lps.definePrototypes(() => {
            lps.currentPage = page = (lps.getPageFromUri() || 'Home')

            lps.loadPage(page)       
        })

        lps.particles.init();
    },

    loadPage: (page) => {
        lps.buildMenu()

        let menuItem = lps.selectmenuItem(page);

        lps.getContentForPage(menuItem.attr('data-page-id'))
    },

    getContentForPage: (pageId) => {
        let page = menu.filter(p => p.id == pageId);
        
        if (page.length > 0) {
            $('[name=render-content]').load('/' + page[0].name.toLowerCase() + '.html', function (response, status, xhr) {
                if (status == "error") {
                    $('[name=render-content]').load('/error.html')
                    error.init();
                }
                else{
                    window[page[0].name.toLowerCase()].init()
                }
            })
        } 
        else {
            $('[name=render-content]').load('/error.html')
            error.init();
        }
    },

    buildMenu: () => {
        menu.filter(p => p.parent === null)
            .map((x) => {
                $('ul.menu:not(.sub)').append(
                    '<li name="' + x.path + '" data-page-id="' + x.id + '" ><a href="/?' + x.path + '">' + x.name + '</a></li>'
                )

                let submenu = menu.filter(p => p.parent == x.id)
                if (submenu.length > 0) {
                    let sublist = $('<ul class="sub menu"></ul>')
                    submenu.map((p) => {
                        sublist.append(
                            '<li name="' + p.path + '" data-page-id="' + p.id + '" ><a href="/?' + p.path + '">' + p.name + '</a></li>'
                        )
                    })
                    $('li[name=' + x.path + ']').append(sublist)
                }
            })
    },

    selectmenuItem: (page) => {
        $('.menu > li.selected').removeClass('selected')

        $('ul.menu > li[name=' + page + ']').addClass('selected')

        return $('ul.menu > li[name=' + page + ']');
    },

    getPageFromUri: () => {
        let url = new URL(window.location)

        let searchItems = url.search;

        let page = searchItems.split(',')[0].replaceAll('?', '')

        return page.length > 0 ? page : null
    },

    definePrototypes: (callback) => {
        // replace all on string prototype //
        Object.defineProperty(String.prototype, 'replaceAll', {
            value: function replaceAll(selection, replacement) {
                selection = selection === '?' ? '\\?' : selection

                return this
                    .replace(new RegExp(selection, 'g'), replacement)
                    .toString();
            }
        })

        // clone for models //
        Object.defineProperty(Object.prototype, 'clone', {
            value: function clone() {
                return JSON.parse(JSON.stringify(this));
            }
        })

        if (callback) {
            callback()
        }
    },

    particles: {
        circles: [],
        init: function () {
            let particleCount = 0;

            let particle = new Image();
            particle.src = "/particle.png";
            particle.onload = () => {
                lps.particles.setup(particle)
            }

        },

        setup: (particles) => {
            let canvas = $('[name=canvas]')[0]
            let mainContext = canvas.getContext('2d');
            canvas.height = window.innerHeight + 500;
            canvas.width = window.innerWidth + 500;
            $(canvas).css({
                'margin-top': '-250px',
                'margin-left': '-250px'
            })

            lps.particles.particles.prototype.update = function () {

                this.angle = this.angle + Math.random() * 0.02

                mainContext.save();

                this.counter += this.sign * this.speed;

                mainContext.rotate(this.angle * (Math.PI / 180));

                mainContext.globalAlpha = this.opacity;

                mainContext.drawImage(particles, this.xPos + Math.cos(this.counter / 100) * this.radius, this.yPos + Math.sin(this.counter / 100) * this.radius, this.width, this.width)

                mainContext.globalAlpha = 1;

                mainContext.restore();
            };
            lps.particles.drawparticles(mainContext)
        },

        particles: function (radius, speed, width, xPos, yPos, maincontext) {
            this.radius = radius;
            this.speed = speed;
            this.width = width;
            this.xPos = xPos;
            this.yPos = yPos;
            this.opacity = Math.floor(Math.random() * (0.4 - 0.2 + 1)) + 0.2;
            this.angle = Math.floor(Math.random() * (360 - 0 + 1)) + 0;

            this.counter = 0;

            var signHelper = Math.floor(Math.random() * 2);

            if (signHelper == 1) {
                this.sign = -1;
            } else {
                this.sign = 1;
            }
        },

        drawparticles: (ctx) => {
            for (var i = 0; i < 1500; i++) {
                var randomX = Math.round(Math.random() * (window.innerWidth + 500));
                var randomY = Math.round(Math.random() * (window.innerHeight + 500));
                var speed = 0.02 + Math.random() * 0.5;
                var size = Math.floor(Math.random() * 15);

                var circle = new lps.particles.particles(100, speed, size, randomX, randomY);
                lps.particles.circles.push(circle);
            }
            lps.particles.draw(ctx);
        },

        draw: (mainContext) => {
            mainContext.clearRect(0, 0, (window.innerWidth + 500), (window.innerHeight + 500));

            for (var i = 0; i < lps.particles.circles.length; i++) {
                var myCircle = lps.particles.circles[i];
                myCircle.update();
            }
            requestAnimationFrame(function () {
                lps.particles.draw(mainContext)
            });
        }

    },

    fucks: {
        given: () => {
            return 0
        }
    }
}

home = {
    init:() =>{
        var root = $('[name=home].content')
    }
}

error = {
    init:() =>{
        console.log('Error No page Found')
    }
}

contact = {
    init:() =>{
    }
}

$(function () {
    lps.init();
})
