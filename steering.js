//  steering.js
//  Developed by Swarup Selvaraj

function Steering(settings)
{
    if (settings.svg_id != null && document.getElementById(settings.svg_id)!=null && settings.g_id != null && document.getElementById(settings.g_id)!=null)
    {
        this.settings = {};
        this.settings.svg_id = settings.svg_id;
        this.settings.g_id = settings.g_id;
        this.settings.i_zoom = (settings.i_zoom == null) ? true : ((settings.i_zoom) ? true : false);
        this.settings.fit = (settings.fit == null || (settings.fit != 'width' && settings.fit != 'height' && settings.fit != 'auto')) ? 'width' : settings.fit;
        this.settings.x = 0;	this.settings.y = 0;	this.settings.dx = 0;	this.settings.dy = 0;
        this.settings.s = 1;	this.settings.down = false;
        this.settings.e = 0;	this.settings.f = 0;    this.settings.active = (settings.active == null) ? false : ((settings.active) ? true : false);
        this.settings.mod = ['CapsLock', 'Alt', 'Control', 'Shift', 'NumLocK', 'ScrollLock', 'Meta', 'AltGraph'];
        if (settings.modifier == null){ this.settings.modifier = this.settings.mod[0]; } 
        else if (this.settings.mod.indexOf(settings.modifier) == -1) 
        { 
            console.log('Error: Unable to find \'' + settings.modifier + '\' in ' + this.settings.mod + '\n\nModifiers from the above list alone are allowed!\n\n\tReverting back to default modifier \'' + this.settings.mod[0] + '\'!');
            this.settings.modifier = this.settings.mod[0];
        }
        else {   this.settings.modifier = this.settings.mod[this.settings.mod.indexOf(settings.modifier)];  }
        
        this.svg = document.getElementById(this.settings.svg_id);
        this.grp = document.getElementById(this.settings.g_id);

        this.initDims = function (e) {
            this.divs = this.svg.getBoundingClientRect();
            this.dims = {};		this.dims.PixX = this.svg.viewBox.baseVal.width;	this.dims.PixY = this.svg.viewBox.baseVal.height;

            if (this.settings.fit == 'auto')
            {
                this.dims.DivX = (this.divs.width == Math.min(this.divs.width, this.divs.height)) ? this.divs.width : this.divs.height * this.dims.PixX / this.dims.PixY;
                this.dims.DivY = (this.divs.height == Math.min(this.divs.width, this.divs.height)) ? this.divs.height : this.divs.width * this.dims.PixY / this.dims.PixX;
            }
            else if (this.settings.fit == 'height')
            {
                this.dims.DivX = this.divs.height * this.dims.PixX / this.dims.PixY;
                this.dims.DivY = this.divs.height;
            }
            else
            {
                this.dims.DivX = this.divs.width;
                this.dims.DivY = this.divs.width * this.dims.PixY / this.dims.PixX;
            }
            this.dims.x = e.pageX - (this.divs.x == null ? this.divs.left : this.divs.x);
            this.dims.y = e.pageY - (this.divs.x == null ? this.divs.top : this.divs.y);

            this.dims.Sc = this.dims.PixX / this.dims.DivX;		this.dims.Mat = this.grp.transform.baseVal.getItem(0).matrix;
        };

        this.initDims({'pageX': 0, 'pageY': 0})
        
        this.svg.setAttribute('style', 'width: ' + String(this.dims.DivX) + 'px; height: ' + String(this.dims.DivY) + 'px; overflow: hidden;');	

        this.applyTransform = function (m) {
            var vbox = this.svg.viewBox.baseVal
            var mat = this.grp.transform.baseVal.getItem(0).matrix;
            if (m.a==null) m.a = mat.a;		if (m.b==null) m.b = mat.b;		if (m.c==null) m.c = mat.c;
            if (m.d==null) m.d = mat.d;		if (m.e==null) m.e = mat.e;		if (m.f==null) m.f = mat.f;
            if (m.e < -vbox.width * m.a) m.e = -vbox.width * m.a;		if (m.f < -vbox.height * m.d) m.f = -vbox.height * m.d;
            if (m.e > vbox.width) m.e = vbox.width;						if (m.f > vbox.height) m.f = vbox.height;
            this.grp.setAttribute('transform', 'matrix(' + String(m.a) + ' ' + String(m.b) + ' ' + String(m.c) + ' ' + String(m.d) + ' ' + String(m.e) + ' ' + String(m.f)+ ')');
        };

        this.recenter = function ()	{
            this.applyTransform({'a': 1, 'b': 0, 'c': 0, 'd': 1, 'e': 0, 'f': 0});
            this.settings.x=0;		this.settings.y=0;		this.settings.s=1;		this.settings.down = false;
        };



        this.moveEvent = function (e)	{
            if (e.currentTarget.steering.settings.active || e.getModifierState(e.currentTarget.steering.settings.modifier))
            {
                if (e.currentTarget.steering.settings.down)
                {
                    e.currentTarget.style.cursor = 'grabbing';
                    e.currentTarget.steering.initDims(e);
                    //console.log(e.movementX);
                    e.currentTarget.steering.settings.dx = e.currentTarget.steering.dims.x - e.currentTarget.steering.settings.x;		
                    e.currentTarget.steering.settings.dy = e.currentTarget.steering.dims.y - e.currentTarget.steering.settings.y;
                    e.currentTarget.steering.applyTransform({'e': e.currentTarget.steering.settings.e + e.currentTarget.steering.settings.dx * e.currentTarget.steering.dims.Sc, 'f': e.currentTarget.steering.settings.f + e.currentTarget.steering.settings.dy * e.currentTarget.steering.dims.Sc});
                }
                else
                {
                    e.currentTarget.style.cursor = 'grab';
                }
            }
            else
            {
                e.currentTarget.style.cursor = 'crosshair';
            }
        };


        this.scrollEvent = function (e){
            e.currentTarget.steering.initDims(e);
            if (e.currentTarget.steering.settings.s-(e.deltaY / Math.abs(e.deltaY)) >=1 && e.currentTarget.steering.settings.s-(e.deltaY / Math.abs(e.deltaY)) <= e.currentTarget.steering.dims.Sc)
            {
                if(e.deltaY > 0)
                {
                    e.currentTarget.style.cursor = 'zoom-out';
                }
                else
                {
                    e.currentTarget.style.cursor = 'zoom-in';
                }
                e.currentTarget.steering.settings.down = false;
                e.currentTarget.steering.settings.s -= (e.deltaY / Math.abs(e.deltaY));
                if(e.currentTarget.steering.settings.i_zoom)
                {
                    e.currentTarget.steering.applyTransform({'a': e.currentTarget.steering.settings.s, 'd': e.currentTarget.steering.settings.s,'e': (e.currentTarget.steering.dims.Mat.e / e.currentTarget.steering.dims.Mat.a + e.currentTarget.steering.dims.x * e.currentTarget.steering.dims.Sc * (1/e.currentTarget.steering.settings.s - 1/e.currentTarget.steering.dims.Mat.a)) * e.currentTarget.steering.settings.s, 'f': (e.currentTarget.steering.dims.Mat.f / e.currentTarget.steering.dims.Mat.a + e.currentTarget.steering.dims.y * e.currentTarget.steering.dims.Sc * (1/e.currentTarget.steering.settings.s - 1/e.currentTarget.steering.dims.Mat.a)) * e.currentTarget.steering.settings.s});
                }
                else
                {
                    applyTransform({'a': e.currentTarget.steering.settings.s, 'd': e.currentTarget.steering.settings.s,'e': e.currentTarget.steering.dims.Mat.e * e.currentTarget.steering.settings.s/e.currentTarget.steering.dims.Mat.a, 'f': e.currentTarget.steering.dims.Mat.f * e.currentTarget.steering.settings.s/e.currentTarget.steering.dims.Mat.a});
                }
            }
        };

        this.downEvent = function (e)	{
            if (event.preventDefault) 
                event.preventDefault();
            if (e.currentTarget.steering.settings.active || e.getModifierState(e.currentTarget.steering.settings.modifier))
            {
                e.currentTarget.steering.initDims(e);	e.currentTarget.steering.settings.down = true;
                e.currentTarget.steering.settings.x = e.currentTarget.steering.dims.x;	e.currentTarget.steering.settings.y = e.currentTarget.steering.dims.y;
                e.currentTarget.steering.settings.e = e.currentTarget.steering.dims.Mat.e;
                e.currentTarget.steering.settings.f = e.currentTarget.steering.dims.Mat.f;
            }
        };
        this.upEvent = function (e)
        {
            e.currentTarget.steering.settings.down = false;
        };

        this.construct = function()
        {
            this.svg.addEventListener("mousedown", this.downEvent);
            this.svg.addEventListener("wheel", this.scrollEvent, true);						
            this.svg.addEventListener("mouseup", this.upEvent);
            this.svg.addEventListener("mousemove", this.moveEvent, true);
            this.svg.steering = this;
            this.recenter();
        };

        this.destroy = function()
        {
            this.svg.removeEventListener("mousedown", this.downEvent);
            this.svg.removeEventListener("mouseup", this.upEvent);
            this.svg.removeEventListener("mousemove", this.moveEvent, true);
            this.svg.removeEventListener("wheel", this.scrollEvent, true);
            this.svg.steering = null;
            delete this;
        };

        this.construct();

    }
    else
    {
        this.error = 'Steering Class Error : Unable to initialize Steering control for svg_id : "' + settings.svg_id +'" and g_id : "' + settings.g_id + '"\n\nCheck if the settings dictionary passed on to steering has a valid svg_id and g_id\n\nSYNTAX\n\tvar steer1 = new Steering({\'svg_id\': \'graph\', \'g_id\': \'group\'})' ;
        console.log(this.error)
    }
}