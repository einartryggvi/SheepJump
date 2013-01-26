define ['controls'], (controls) ->
  class Player
    speedX: 200
    speedY: 200

    constructor: (el) ->
      @el = el
      @pos =
        x: 0
        y: 0

    onFrame: (delta) ->
      if controls.spacePressed
        @pos.x += delta * @speedX
        @pos.y += delta * @speedY

      if @pos.x > 800 or @pos.x < 0
        @speedX *= -1
      
      if @pos.y > 200 or @pos.y < 0
        @speedY *= -1
      
      # Update UI
      if @speedY < 0
        @el.find('div').find('div').not('.l_eye, .r_eye').css 'background', '#c00'
      else if @speedX < 0
        @el.find('div').find('div').not('.l_eye, .r_eye').css 'background', '#0cc'
      else
        @el.find('div').find('div').not('.l_eye, .r_eye').css 'background', '#A4CA39'
      @el.css '-webkit-transform', "translate(#{@pos.x}px,#{@pos.y}px)"

  return Player;
