/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    // canvas setup
    const canvas = document.querySelector('#doodler')
    const ctx = canvas.getContext('2d')
    
    // context defaults
    let isDark = true

    const getModeColour = function () {
        return isDark ? "black" : "white"
    }

    canvas.style.setProperty("background", getModeColour())

    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    // handle drawing
    let isDrawing = false
    let lastX = 0
    let lastY = 0
    let hue
    let brushSize

    function draw(offsetX, offsetY) {
        if (!isDrawing) {
            return
        }
        
        ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`
        ctx.lineWidth = brushSize;

        ctx.beginPath()
        ctx.moveTo(lastX, lastY)
        ctx.lineTo(offsetX, offsetY)
        ctx.stroke()

        lastX = offsetX
        lastY = offsetY
    }

    function startDrawingMouse(e) {
        isDrawing = true

        lastX = e.offsetX
        lastY = e.offsetY

        draw(e)
    }

    function startDrawingTouch(e) {
        e.preventDefault()

        isDrawing = true

        lastX = e.touches[0].clientX
        lastY = e.touches[0].clientY

        draw(e)
    }

    // desktop
    canvas.addEventListener("mousedown", e => startDrawingMouse(e))
    canvas.addEventListener("mousemove", e => draw(e.offsetX, e.offsetY))
    canvas.addEventListener("mouseup", () => isDrawing = false)
    canvas.addEventListener("mouseout", () => isDrawing = false)

    // tablet
    canvas.addEventListener("touchstart", e => startDrawingTouch(e))
    canvas.addEventListener("touchmove", e => draw(e.touches[0].clientX, e.touches[0].clientY))
    canvas.addEventListener("touchend", () => isDrawing = false)

    // colour picker
    const huePicker = document.getElementById("huePicker")

    hue = huePicker.value

    const updateHue = function () {
        hue = this.value
        document.documentElement.style.setProperty("--hue", this.value)
    }

    huePicker.addEventListener("change", updateHue)
    huePicker.addEventListener("mousemove", updateHue)
    huePicker.addEventListener("touchstart", updateHue)
    huePicker.addEventListener("touchmove", updateHue)

    // brush size
    const brushSizePicker = document.getElementById("brushSizePicker")

    brushSize = brushSizePicker.value

    const updateBrushSize = function () {
        brushSize = this.value
        document.documentElement.style.setProperty("--brush-size", this.value + 'px')
    }

    brushSizePicker.addEventListener("change", updateBrushSize)
    brushSizePicker.addEventListener("mousemove", updateBrushSize)
    brushSizePicker.addEventListener("touchstart", updateBrushSize)
    brushSizePicker.addEventListener("touchmove", updateBrushSize)
    
    // dark mode toggle
    const toggleCanvasBackgroundBtn = document.getElementById("toggleCanvasBackgroundBtn")

    toggleCanvasBackgroundBtn.addEventListener("click", function (e) {
        isDark = !isDark

        canvas.style.setProperty("background", getModeColour())
    })

    // reset
    const resetCanvasBtn = document.getElementById("resetCanvasBtn")

    resetCanvasBtn.addEventListener("click", function (e) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    })

    // save
    const saveDrawingBtn = document.getElementById("saveDrawingBtn")

    saveDrawingBtn.addEventListener("click", function (e) {
        // TODO
    })
}
