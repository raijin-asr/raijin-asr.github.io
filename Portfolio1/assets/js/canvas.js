var c = document.getElementById("canv");
var $ = c.getContext("2d");
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var num = 90;
var max = 110;
var u = 0;
var dtr = function(d) {
return d * Math.PI / 300;
};

var rnd = function() {
return Math.sin(Math.floor(Math.random() * 360) * Math.PI / 180);
};

var dst = function(p1, p2) {
return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

var pov = {
cam: {
    x: 0,
    y: 0,
    z: w * 2
},
mark: {
    x: 0,
    y: 0,
    z: 0
},
dst: {
    x: 0,
    y: 0,
    z: 0
},
ang: {
    phic: 0,
    phis: 0,
    thetac: 0,
    thetas: 0
},
zoom: 1,
disp: {
    x: w / 2,
    y: h / 2,
    z: 0
},
upd: function() {
    pov.dst.x = pov.mark.x - pov.cam.x;
    pov.dst.y = pov.mark.y - pov.cam.y;
    pov.dst.z = pov.mark.z - pov.cam.z;
    pov.ang.phic = -pov.dst.z / Math.sqrt(pov.dst.x * pov.dst.x + pov.dst.z * pov.dst.z);
    pov.ang.phis = pov.dst.x / Math.sqrt(pov.dst.x * pov.dst.x + pov.dst.z * pov.dst.z);
    pov.ang.thetac = Math.sqrt(pov.dst.x * pov.dst.x + pov.dst.z * pov.dst.z) / Math.sqrt(pov.dst.x * pov.dst.x + pov.dst.y * pov.dst.y + pov.dst.z * pov.dst.z);
    pov.ang.thetas = -pov.dst.y / Math.sqrt(pov.dst.x * pov.dst.x + pov.dst.y * pov.dst.y + pov.dst.z * pov.dst.z);
}
};

var trans = {
obj: {
    sz: function(p, sz) {
    return {
        x: p.x * sz.x,
        y: p.y * sz.y,
        z: p.z * sz.z
    };
    },
    rot: {
    x: function(p, rot) {
        return {
        x: p.x,
        y: p.y * Math.cos(dtr(rot.x)) - p.z * Math.sin(dtr(rot.x)),
        z: p.y * Math.sin(dtr(rot.x)) + p.z * Math.cos(dtr(rot.x))
        };
    },
    y: function(p, rot) {
        return {
        x: p.x * Math.cos(dtr(rot.y)) + p.z * Math.sin(dtr(rot.y)),
        y: p.y,
        z: -p.x * Math.sin(dtr(rot.y)) + p.z * Math.cos(dtr(rot.y))
        };
    },
    z: function(p, rot) {
        return {
        x: p.x * Math.cos(dtr(rot.z)) - p.y * Math.sin(dtr(rot.z)),
        y: p.x * Math.sin(dtr(rot.z)) + p.y * Math.cos(dtr(rot.z)),
        z: p.z
        };
    }
    },
    pos: function(p, pos) {
    return {
        x: p.x + pos.x,
        y: p.y + pos.y,
        z: p.z + pos.z
    };
    }
},
foc: {
    phi: function(p) {
    return {
        x: p.x * pov.ang.phic + p.z * pov.ang.phis,
        y: p.y,
        z: p.x * -pov.ang.phis + p.z * pov.ang.phic
    };
    },
    theta: function(p) {
    return {
        x: p.x,
        y: p.y * pov.ang.thetac - p.z * pov.ang.thetas,
        z: p.y * pov.ang.thetas + p.z * pov.ang.thetac
    };
    },
    res: function(p) {
    return {
        x: p.x - pov.cam.x,
        y: p.y - pov.cam.y,
        z: p.z - pov.cam.z
    };
    }
},
persp: function(p) {
    return {
    x: p.x * pov.dst.z / p.z * pov.zoom,
    y: p.y * pov.dst.z / p.z * pov.zoom,
    z: p.z * pov.zoom,
    p: pov.dst.z / p.z
    };
},
disp: function(p, disp) {
    return {
    x: p.x + disp.x,
    y: -p.y + disp.y,
    z: p.z + disp.z,
    p: p.p
    };
},
calc: function(model, sz, rot, pos, disp) {
    var ret = trans.obj.sz(model, sz);
    ret = trans.obj.rot.x(ret, rot);
    ret = trans.obj.rot.y(ret, rot);
    ret = trans.obj.rot.z(ret, rot);
    ret = trans.obj.pos(ret, pos);
    ret = trans.foc.phi(ret);
    ret = trans.foc.theta(ret);
    ret = trans.foc.res(ret);
    ret = trans.persp(ret);
    ret = trans.disp(ret, disp);
    return ret;
}
};


var vtx = function(prm) {
this.transIn = {};
this.transOut = {};
this.transIn.vx = (prm.vx);
this.transIn.sz = (prm.sz);
this.transIn.rot = (prm.rot);
this.transIn.pos = (prm.pos);
};
vtx.prototype.vupd = function() {
this.transOut = trans.calc(
    this.transIn.vx,
    this.transIn.sz,
    this.transIn.rot,
    this.transIn.pos,
    pov.disp
);
};


$.lineWidth = .1;
$.fillStyle = 'hsla(0, 5%, 25%, 1)';
$.strokeStyle ='hsla(0, 5%, 25%, 1)';

var v = [];
var dist = [];

for (var i = 0; i < num; i++) {
v[i] = new vtx({
    vx: {
    x: rnd(),
    y: rnd(),
    z: rnd()
    },
    sz: {
    x: 0,
    y: 0,
    z: 0
    },
    rot: {
    x: 10,
    y: -10,
    z: 0
    },
    pos: {
    x: 0,
    y: 0,
    z: 0
    }
});
}

var orot = {
x: 0,
y: 0,
z: 0
};

var osz = {
x: w / 4,
y: h / 4,
z: w / 4
};
var text = function(){
    var txt = "Ameer Sampang Rai".split("").join(String.fromCharCode(0x2004));
$.font = "3.5em Poiret One";
$.fillStyle = 'hsla(0, 10%, 85%, 1)';
$.fillText(txt, (c.width - $.measureText(txt).width) * 0.5, c.height * 0.5);
return txt;
}
var draw = function() {

$.fillStyle = 'hsla(0, 5%, 95%, 1)';
$.fillRect(0, 0, c.width, c.height);
text();
pov.upd();
orot.x += 2;
orot.y += 1;
orot.z += 0.5;

for (var i in v) {
    v[i].transIn.rot = orot;
    v[i].transIn.sz = osz;
    v[i].vupd();

    dist[i] = {
    x: v[i].transOut.x,
    y: v[i].transOut.y
    };
}
    
for (var s in dist) {
    for (var k in dist) {
    if (s === k) continue;
    var distan = dst(dist[s], dist[k]);
    if (distan < max) {
        $.save();
        $.beginPath();
        $.moveTo(dist[s].x, dist[s].y);
        $.arc(dist[k].x, dist[k].y, 0.1, 0, Math.PI*2);
        $.stroke();
        $.closePath();
    }
    }
}

};

window.addEventListener('resize', function(){
c.width = window.innerWidth;
c.height = window.innerHeight;
$.strokeStyle ='hsla(0, 5%, 25%, 1)';
$.lineWidth = .1;
}, false);
function run() {
    window.requestAnimationFrame(run);
    draw();
};
run();
