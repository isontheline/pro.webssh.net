/**
 * Copyright (c) 2012-2024, Arnaud MENGUS (MIT License)
 * https://github.com/isontheline/pro.webssh.net
 * @license MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

class Scrolly {
    static defaultOptions = {
        height: 50,
        width: 20,
        opacity: 0.3,
        opacityOver: 0.7,
        opacityDrag: 0.9,
        isVisible: true,
        cursor: 'grab',
        handedness: 'right',
    }

    static defaultStyles = {
        width: Scrolly.defaultOptions.width + 'px',
        height: Scrolly.defaultOptions.height + 'px',
        color: '#666',
        fontSize: Scrolly.defaultOptions.width + 'px',
        lineHeight: Scrolly.defaultOptions.height + 'px',
        fontWeight: 'bold',
        textAlign: 'center',
        border: '1px solid #666',
        borderRadius: '5px',
        position: 'absolute',
        top: '0',
        right: '1px',
        cursor: Scrolly.defaultOptions.cursor,
        opacity: Scrolly.defaultOptions.opacity,
        zIndex: '9999',
        display: 'none',
        background: "-webkit-gradient(linear,left top,left bottom,from(#fff),to(#aaa))",
        userSelect: 'none',
        '-webkit-user-select': 'none',
    }

    constructor(options) {
        const that = this;

        this.isDragging = false;

        this.options = {
            ...Scrolly.defaultOptions,
            ...options
        };

        this.styles = {
            ...Scrolly.defaultStyles,
            ...options.styles,
            ...{
                right: options.handedness == undefined || options.handedness === 'right' ? '1px' : '',
                left: options.handedness != undefined && options.handedness === 'left' ? '1px' : '',
            }
        }

        Object.assign(this.options.scrollbarElement.style, this.styles);

        this.options.scrollbarElement.innerHTML = '<div>&#xFE19;</div>';

        this.options.elementToScroll.onscroll = function () {
            const element = this;
            const scrollPosition = element.scrollTop;
            const scrollTopMaximum = element.scrollHeight - element.clientHeight;
            const scrollPercent = scrollPosition / scrollTopMaximum;
            const scrollbarElementHeight = that.options.height;

            var scrollbarTop = scrollPercent * this.offsetHeight - scrollbarElementHeight;

            if (scrollbarTop < 0) {
                scrollbarTop = 0;
            }

            Object.assign(that.options.scrollbarElement.style, {
                top: scrollbarTop + 'px',
                display: that.options.isVisible ? 'block' : 'none',
            });
        }

        this.options.scrollbarElement.onmouseover = function () {
            if (!that.isDragging) {
                Object.assign(that.options.scrollbarElement.style, {
                    opacity: that.options.opacityOver,
                });
            }
        }

        this.options.scrollbarElement.onmouseout = function () {
            if (!that.isDragging) {
                Object.assign(that.options.scrollbarElement.style, {
                    opacity: that.styles.opacity,
                });
            }
        }

        this.options.scrollbarElement.ontouchstart =
            this.options.scrollbarElement.onmousedown = function (event) {
                event.preventDefault();
                event.stopPropagation();
                
                that.isDragging = true;

                Object.assign(that.options.scrollbarElement.style, {
                    opacity: that.options.opacityDrag,
                    cursor: 'grabbing',
                });

                document.addEventListener('mousemove', that.onMouseMove);
                document.addEventListener('touchmove', that.onMouseMove);
                document.addEventListener('mouseup', that.onMouseUp);
                document.addEventListener('touchend', that.onMouseUp);
            }

        this.onMouseUp = function (event) {
            that.isDragging = false;
            document.removeEventListener('mousemove', that.onMouseMove);
            document.removeEventListener('touchmove', that.onMouseMove);
            document.removeEventListener('mouseup', that.onMouseUp);
            document.removeEventListener('touchend', that.onMouseUp);

            Object.assign(that.options.scrollbarElement.style, {
                opacity: that.options.opacityOver,
                cursor: that.options.cursor,
            });

            if (!that.isMouseEventInsideElement(event, that.options.scrollbarElement)) {
                that.options.scrollbarElement.onmouseout();
            }
        }

        this.onMouseMove = function (event) {
            event.preventDefault();
            event.stopPropagation();

            if (that.isDragging) {
                const eventClientY = event.type === 'touchmove' ? event.touches[0].clientY : event.clientY;

                const element = that.options.elementToScroll;
                const scrollTopMaximum = element.scrollHeight - element.clientHeight;
                const elementOffsetHeight = element.offsetHeight;
                const dragY = eventClientY + that.options.height / 2;
                const scrollTop = scrollTopMaximum * (dragY / elementOffsetHeight);

                that.options.elementToScroll.scrollTop = scrollTop;
            }
        }

        this.isMouseEventInsideElement = function (event, element) {
            const rect = element.getBoundingClientRect();
            return event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
        }

        this.hide = function () {
            this.options.isVisible = false;
            Object.assign(that.options.scrollbarElement.style, {
                display: 'none',
            });
        }

        this.show = function () {
            this.options.isVisible = true;
            Object.assign(that.options.scrollbarElement.style, {
                display: 'block',
            });
        }
    }
}
