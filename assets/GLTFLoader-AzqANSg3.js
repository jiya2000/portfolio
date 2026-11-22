import { aj as de, fJ as Le, fH as Q, fI as pe, aD as B, a9 as Se, eE as v, aa as me, _ as S, a4 as ge, C as k, aQ as w, aZ as U, q as we, b2 as Ie, b3 as Ne, ar as K, v as C, eg as Oe, bn as Te, s as Ce, aV as Re, fB as ke, ec as He, aG as Pe, L as Ee, a3 as Fe, a2 as Ge, bu as De, k as J, ay as Ae, bt as Z, bs as ve, aC as Ue, as as Be, ab as X, y as Ke, $ as xe, aK as je, Q as D, e_ as Ve, fl as Xe, i as ze, eB as qe, ew as We, eA as Ye, eW as Qe, G as z, al as Je, a1 as Ze, ak as $e, fj as et, d3 as tt, dk as nt, em as st, en as ye, I as rt, T as te, fP as ne, eP as se, f2 as re, b as ie, b0 as it, ek as ot, dn as at, ai as ct } from "./projects-DEZFQUrs.js";
function Vt(f, t = false) {
  const e = f[0].index !== null, s = new Set(Object.keys(f[0].attributes)), n = new Set(Object.keys(f[0].morphAttributes)), r = {}, i = {}, c = f[0].morphTargetsRelative, o = new de();
  let u = 0;
  for (let a = 0; a < f.length; ++a) {
    const l = f[a];
    let h = 0;
    if (e !== (l.index !== null)) return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + a + ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."), null;
    for (const d in l.attributes) {
      if (!s.has(d)) return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + a + '. All geometries must have compatible attributes; make sure "' + d + '" attribute exists among all geometries, or in none of them.'), null;
      r[d] === void 0 && (r[d] = []), r[d].push(l.attributes[d]), h++;
    }
    if (h !== s.size) return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + a + ". Make sure all geometries have the same number of attributes."), null;
    if (c !== l.morphTargetsRelative) return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + a + ". .morphTargetsRelative must be consistent throughout all geometries."), null;
    for (const d in l.morphAttributes) {
      if (!n.has(d)) return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + a + ".  .morphAttributes must be consistent throughout all geometries."), null;
      i[d] === void 0 && (i[d] = []), i[d].push(l.morphAttributes[d]);
    }
    if (t) {
      let d;
      if (e) d = l.index.count;
      else if (l.attributes.position !== void 0) d = l.attributes.position.count;
      else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " + a + ". The geometry must have either an index or a position attribute"), null;
      o.addGroup(u, d, a), u += d;
    }
  }
  if (e) {
    let a = 0;
    const l = [];
    for (let h = 0; h < f.length; ++h) {
      const d = f[h].index;
      for (let p = 0; p < d.count; ++p) l.push(d.getX(p) + a);
      a += f[h].attributes.position.count;
    }
    o.setIndex(l);
  }
  for (const a in r) {
    const l = oe(r[a]);
    if (!l) return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + a + " attribute."), null;
    o.setAttribute(a, l);
  }
  for (const a in i) {
    const l = i[a][0].length;
    if (l === 0) break;
    o.morphAttributes = o.morphAttributes || {}, o.morphAttributes[a] = [];
    for (let h = 0; h < l; ++h) {
      const d = [];
      for (let T = 0; T < i[a].length; ++T) d.push(i[a][T][h]);
      const p = oe(d);
      if (!p) return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " + a + " morphAttribute."), null;
      o.morphAttributes[a].push(p);
    }
  }
  return o;
}
function oe(f) {
  let t, e, s, n = -1, r = 0;
  for (let u = 0; u < f.length; ++u) {
    const a = f[u];
    if (t === void 0 && (t = a.array.constructor), t !== a.array.constructor) return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."), null;
    if (e === void 0 && (e = a.itemSize), e !== a.itemSize) return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."), null;
    if (s === void 0 && (s = a.normalized), s !== a.normalized) return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."), null;
    if (n === -1 && (n = a.gpuType), n !== a.gpuType) return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."), null;
    r += a.count * e;
  }
  const i = new t(r), c = new B(i, e, s);
  let o = 0;
  for (let u = 0; u < f.length; ++u) {
    const a = f[u];
    if (a.isInterleavedBufferAttribute) {
      const l = o / e;
      for (let h = 0, d = a.count; h < d; h++) for (let p = 0; p < e; p++) {
        const T = a.getComponent(h, p);
        c.setComponent(h + l, p, T);
      }
    } else i.set(a.array, o);
    o += a.count * e;
  }
  return n !== void 0 && (c.gpuType = n), c;
}
function ae(f, t) {
  if (t === Le) return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), f;
  if (t === Q || t === pe) {
    let e = f.getIndex();
    if (e === null) {
      const i = [], c = f.getAttribute("position");
      if (c !== void 0) {
        for (let o = 0; o < c.count; o++) i.push(o);
        f.setIndex(i), e = f.getIndex();
      } else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), f;
    }
    const s = e.count - 2, n = [];
    if (t === Q) for (let i = 1; i <= s; i++) n.push(e.getX(0)), n.push(e.getX(i)), n.push(e.getX(i + 1));
    else for (let i = 0; i < s; i++) i % 2 === 0 ? (n.push(e.getX(i)), n.push(e.getX(i + 1)), n.push(e.getX(i + 2))) : (n.push(e.getX(i + 2)), n.push(e.getX(i + 1)), n.push(e.getX(i)));
    n.length / 3 !== s && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    const r = f.clone();
    return r.setIndex(n), r.clearGroups(), r;
  } else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", t), f;
}
function ut(f) {
  const t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Map(), s = f.clone();
  return _e(f, s, function(n, r) {
    t.set(r, n), e.set(n, r);
  }), s.traverse(function(n) {
    if (!n.isSkinnedMesh) return;
    const r = n, i = t.get(n), c = i.skeleton.bones;
    r.skeleton = i.skeleton.clone(), r.bindMatrix.copy(i.bindMatrix), r.skeleton.bones = c.map(function(o) {
      return e.get(o);
    }), r.bind(r.skeleton, r.bindMatrix);
  }), s;
}
function _e(f, t, e) {
  e(f, t);
  for (let s = 0; s < f.children.length; s++) _e(f.children[s], t.children[s], e);
}
class Xt extends Se {
  constructor(t) {
    super(t), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(e) {
      return new pt(e);
    }), this.register(function(e) {
      return new mt(e);
    }), this.register(function(e) {
      return new bt(e);
    }), this.register(function(e) {
      return new Mt(e);
    }), this.register(function(e) {
      return new Lt(e);
    }), this.register(function(e) {
      return new Tt(e);
    }), this.register(function(e) {
      return new Rt(e);
    }), this.register(function(e) {
      return new Et(e);
    }), this.register(function(e) {
      return new At(e);
    }), this.register(function(e) {
      return new dt(e);
    }), this.register(function(e) {
      return new xt(e);
    }), this.register(function(e) {
      return new gt(e);
    }), this.register(function(e) {
      return new _t(e);
    }), this.register(function(e) {
      return new yt(e);
    }), this.register(function(e) {
      return new ft(e);
    }), this.register(function(e) {
      return new ce(e, g.EXT_MESHOPT_COMPRESSION);
    }), this.register(function(e) {
      return new ce(e, g.KHR_MESHOPT_COMPRESSION);
    }), this.register(function(e) {
      return new St(e);
    });
  }
  load(t, e, s, n) {
    const r = this;
    let i;
    if (this.resourcePath !== "") i = this.resourcePath;
    else if (this.path !== "") {
      const u = v.extractUrlBase(t);
      i = v.resolveURL(u, this.path);
    } else i = v.extractUrlBase(t);
    this.manager.itemStart(t);
    const c = function(u) {
      n ? n(u) : console.error(u), r.manager.itemError(t), r.manager.itemEnd(t);
    }, o = new me(this.manager);
    o.setPath(this.path), o.setResponseType("arraybuffer"), o.setRequestHeader(this.requestHeader), o.setWithCredentials(this.withCredentials), o.load(t, function(u) {
      try {
        r.parse(u, i, function(a) {
          e(a), r.manager.itemEnd(t);
        }, c);
      } catch (a) {
        c(a);
      }
    }, s, c);
  }
  setDRACOLoader(t) {
    return this.dracoLoader = t, this;
  }
  setKTX2Loader(t) {
    return this.ktx2Loader = t, this;
  }
  setMeshoptDecoder(t) {
    return this.meshoptDecoder = t, this;
  }
  register(t) {
    return this.pluginCallbacks.indexOf(t) === -1 && this.pluginCallbacks.push(t), this;
  }
  unregister(t) {
    return this.pluginCallbacks.indexOf(t) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(t), 1), this;
  }
  parse(t, e, s, n) {
    let r;
    const i = {}, c = {}, o = new TextDecoder();
    if (typeof t == "string") r = JSON.parse(t);
    else if (t instanceof ArrayBuffer) if (o.decode(new Uint8Array(t, 0, 4)) === be) {
      try {
        i[g.KHR_BINARY_GLTF] = new wt(t);
      } catch (l) {
        n && n(l);
        return;
      }
      r = JSON.parse(i[g.KHR_BINARY_GLTF].content);
    } else r = JSON.parse(o.decode(t));
    else r = t;
    if (r.asset === void 0 || r.asset.version[0] < 2) {
      n && n(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const u = new Bt(r, { path: e || this.resourcePath || "", crossOrigin: this.crossOrigin, requestHeader: this.requestHeader, manager: this.manager, ktx2Loader: this.ktx2Loader, meshoptDecoder: this.meshoptDecoder });
    u.fileLoader.setRequestHeader(this.requestHeader);
    for (let a = 0; a < this.pluginCallbacks.length; a++) {
      const l = this.pluginCallbacks[a](u);
      l.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), c[l.name] = l, i[l.name] = true;
    }
    if (r.extensionsUsed) for (let a = 0; a < r.extensionsUsed.length; ++a) {
      const l = r.extensionsUsed[a], h = r.extensionsRequired || [];
      switch (l) {
        case g.KHR_MATERIALS_UNLIT:
          i[l] = new ht();
          break;
        case g.KHR_DRACO_MESH_COMPRESSION:
          i[l] = new It(r, this.dracoLoader);
          break;
        case g.KHR_TEXTURE_TRANSFORM:
          i[l] = new Nt();
          break;
        case g.KHR_MESH_QUANTIZATION:
          i[l] = new Ot();
          break;
        default:
          h.indexOf(l) >= 0 && c[l] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + l + '".');
      }
    }
    u.setExtensions(i), u.setPlugins(c), u.parse(s, n);
  }
  parseAsync(t, e) {
    const s = this;
    return new Promise(function(n, r) {
      s.parse(t, e, n, r);
    });
  }
}
function lt() {
  let f = {};
  return { get: function(t) {
    return f[t];
  }, add: function(t, e) {
    f[t] = e;
  }, remove: function(t) {
    delete f[t];
  }, removeAll: function() {
    f = {};
  } };
}
function y(f, t, e) {
  const s = f.json.materials[t];
  return s.extensions && s.extensions[e] ? s.extensions[e] : null;
}
const g = { KHR_BINARY_GLTF: "KHR_binary_glTF", KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression", KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual", KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat", KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion", KHR_MATERIALS_IOR: "KHR_materials_ior", KHR_MATERIALS_SHEEN: "KHR_materials_sheen", KHR_MATERIALS_SPECULAR: "KHR_materials_specular", KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission", KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence", KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy", KHR_MATERIALS_UNLIT: "KHR_materials_unlit", KHR_MATERIALS_VOLUME: "KHR_materials_volume", KHR_TEXTURE_BASISU: "KHR_texture_basisu", KHR_TEXTURE_TRANSFORM: "KHR_texture_transform", KHR_MESH_QUANTIZATION: "KHR_mesh_quantization", KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength", EXT_MATERIALS_BUMP: "EXT_materials_bump", EXT_TEXTURE_WEBP: "EXT_texture_webp", EXT_TEXTURE_AVIF: "EXT_texture_avif", EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression", KHR_MESHOPT_COMPRESSION: "KHR_meshopt_compression", EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing" };
class ft {
  constructor(t) {
    this.parser = t, this.name = g.KHR_LIGHTS_PUNCTUAL, this.cache = { refs: {}, uses: {} };
  }
  _markDefs() {
    const t = this.parser, e = this.parser.json.nodes || [];
    for (let s = 0, n = e.length; s < n; s++) {
      const r = e[s];
      r.extensions && r.extensions[this.name] && r.extensions[this.name].light !== void 0 && t._addNodeRef(this.cache, r.extensions[this.name].light);
    }
  }
  _loadLight(t) {
    const e = this.parser, s = "light:" + t;
    let n = e.cache.get(s);
    if (n) return n;
    const r = e.json, o = ((r.extensions && r.extensions[this.name] || {}).lights || [])[t];
    let u;
    const a = new k(16777215);
    o.color !== void 0 && a.setRGB(o.color[0], o.color[1], o.color[2], w);
    const l = o.range !== void 0 ? o.range : 0;
    switch (o.type) {
      case "directional":
        u = new Ne(a), u.target.position.set(0, 0, -1), u.add(u.target);
        break;
      case "point":
        u = new Ie(a), u.distance = l;
        break;
      case "spot":
        u = new we(a), u.distance = l, o.spot = o.spot || {}, o.spot.innerConeAngle = o.spot.innerConeAngle !== void 0 ? o.spot.innerConeAngle : 0, o.spot.outerConeAngle = o.spot.outerConeAngle !== void 0 ? o.spot.outerConeAngle : Math.PI / 4, u.angle = o.spot.outerConeAngle, u.penumbra = 1 - o.spot.innerConeAngle / o.spot.outerConeAngle, u.target.position.set(0, 0, -1), u.add(u.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + o.type);
    }
    return u.position.set(0, 0, 0), L(u, o), o.intensity !== void 0 && (u.intensity = o.intensity), u.name = e.createUniqueName(o.name || "light_" + t), n = Promise.resolve(u), e.cache.add(s, n), n;
  }
  getDependency(t, e) {
    if (t === "light") return this._loadLight(e);
  }
  createNodeAttachment(t) {
    const e = this, s = this.parser, r = s.json.nodes[t], c = (r.extensions && r.extensions[this.name] || {}).light;
    return c === void 0 ? null : this._loadLight(c).then(function(o) {
      return s._getNodeRef(e.cache, c, o);
    });
  }
}
class ht {
  constructor() {
    this.name = g.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return D;
  }
  extendParams(t, e, s) {
    const n = [];
    t.color = new k(1, 1, 1), t.opacity = 1;
    const r = e.pbrMetallicRoughness;
    if (r) {
      if (Array.isArray(r.baseColorFactor)) {
        const i = r.baseColorFactor;
        t.color.setRGB(i[0], i[1], i[2], w), t.opacity = i[3];
      }
      r.baseColorTexture !== void 0 && n.push(s.assignTexture(t, "map", r.baseColorTexture, U));
    }
    return Promise.all(n);
  }
}
class dt {
  constructor(t) {
    this.parser = t, this.name = g.KHR_MATERIALS_EMISSIVE_STRENGTH;
  }
  extendMaterialParams(t, e) {
    const s = y(this.parser, t, this.name);
    return s === null || s.emissiveStrength !== void 0 && (e.emissiveIntensity = s.emissiveStrength), Promise.resolve();
  }
}
class pt {
  constructor(t) {
    this.parser = t, this.name = g.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(t) {
    return y(this.parser, t, this.name) !== null ? S : null;
  }
  extendMaterialParams(t, e) {
    const s = y(this.parser, t, this.name);
    if (s === null) return Promise.resolve();
    const n = [];
    if (s.clearcoatFactor !== void 0 && (e.clearcoat = s.clearcoatFactor), s.clearcoatTexture !== void 0 && n.push(this.parser.assignTexture(e, "clearcoatMap", s.clearcoatTexture)), s.clearcoatRoughnessFactor !== void 0 && (e.clearcoatRoughness = s.clearcoatRoughnessFactor), s.clearcoatRoughnessTexture !== void 0 && n.push(this.parser.assignTexture(e, "clearcoatRoughnessMap", s.clearcoatRoughnessTexture)), s.clearcoatNormalTexture !== void 0 && (n.push(this.parser.assignTexture(e, "clearcoatNormalMap", s.clearcoatNormalTexture)), s.clearcoatNormalTexture.scale !== void 0)) {
      const r = s.clearcoatNormalTexture.scale;
      e.clearcoatNormalScale = new ge(r, r);
    }
    return Promise.all(n);
  }
}
class mt {
  constructor(t) {
    this.parser = t, this.name = g.KHR_MATERIALS_DISPERSION;
  }
  getMaterialType(t) {
    return y(this.parser, t, this.name) !== null ? S : null;
  }
  extendMaterialParams(t, e) {
    const s = y(this.parser, t, this.name);
    return s === null || (e.dispersion = s.dispersion !== void 0 ? s.dispersion : 0), Promise.resolve();
  }
}
class gt {
  constructor(t) {
    this.parser = t, this.name = g.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(t) {
    return y(this.parser, t, this.name) !== null ? S : null;
  }
  extendMaterialParams(t, e) {
    const s = y(this.parser, t, this.name);
    if (s === null) return Promise.resolve();
    const n = [];
    return s.iridescenceFactor !== void 0 && (e.iridescence = s.iridescenceFactor), s.iridescenceTexture !== void 0 && n.push(this.parser.assignTexture(e, "iridescenceMap", s.iridescenceTexture)), s.iridescenceIor !== void 0 && (e.iridescenceIOR = s.iridescenceIor), e.iridescenceThicknessRange === void 0 && (e.iridescenceThicknessRange = [100, 400]), s.iridescenceThicknessMinimum !== void 0 && (e.iridescenceThicknessRange[0] = s.iridescenceThicknessMinimum), s.iridescenceThicknessMaximum !== void 0 && (e.iridescenceThicknessRange[1] = s.iridescenceThicknessMaximum), s.iridescenceThicknessTexture !== void 0 && n.push(this.parser.assignTexture(e, "iridescenceThicknessMap", s.iridescenceThicknessTexture)), Promise.all(n);
  }
}
class Tt {
  constructor(t) {
    this.parser = t, this.name = g.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(t) {
    return y(this.parser, t, this.name) !== null ? S : null;
  }
  extendMaterialParams(t, e) {
    const s = y(this.parser, t, this.name);
    if (s === null) return Promise.resolve();
    const n = [];
    if (e.sheenColor = new k(0, 0, 0), e.sheenRoughness = 0, e.sheen = 1, s.sheenColorFactor !== void 0) {
      const r = s.sheenColorFactor;
      e.sheenColor.setRGB(r[0], r[1], r[2], w);
    }
    return s.sheenRoughnessFactor !== void 0 && (e.sheenRoughness = s.sheenRoughnessFactor), s.sheenColorTexture !== void 0 && n.push(this.parser.assignTexture(e, "sheenColorMap", s.sheenColorTexture, U)), s.sheenRoughnessTexture !== void 0 && n.push(this.parser.assignTexture(e, "sheenRoughnessMap", s.sheenRoughnessTexture)), Promise.all(n);
  }
}
class Rt {
  constructor(t) {
    this.parser = t, this.name = g.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(t) {
    return y(this.parser, t, this.name) !== null ? S : null;
  }
  extendMaterialParams(t, e) {
    const s = y(this.parser, t, this.name);
    if (s === null) return Promise.resolve();
    const n = [];
    return s.transmissionFactor !== void 0 && (e.transmission = s.transmissionFactor), s.transmissionTexture !== void 0 && n.push(this.parser.assignTexture(e, "transmissionMap", s.transmissionTexture)), Promise.all(n);
  }
}
class Et {
  constructor(t) {
    this.parser = t, this.name = g.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(t) {
    return y(this.parser, t, this.name) !== null ? S : null;
  }
  extendMaterialParams(t, e) {
    const s = y(this.parser, t, this.name);
    if (s === null) return Promise.resolve();
    const n = [];
    e.thickness = s.thicknessFactor !== void 0 ? s.thicknessFactor : 0, s.thicknessTexture !== void 0 && n.push(this.parser.assignTexture(e, "thicknessMap", s.thicknessTexture)), e.attenuationDistance = s.attenuationDistance || 1 / 0;
    const r = s.attenuationColor || [1, 1, 1];
    return e.attenuationColor = new k().setRGB(r[0], r[1], r[2], w), Promise.all(n);
  }
}
class At {
  constructor(t) {
    this.parser = t, this.name = g.KHR_MATERIALS_IOR;
  }
  getMaterialType(t) {
    return y(this.parser, t, this.name) !== null ? S : null;
  }
  extendMaterialParams(t, e) {
    const s = y(this.parser, t, this.name);
    return s === null || (e.ior = s.ior !== void 0 ? s.ior : 1.5), Promise.resolve();
  }
}
class xt {
  constructor(t) {
    this.parser = t, this.name = g.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(t) {
    return y(this.parser, t, this.name) !== null ? S : null;
  }
  extendMaterialParams(t, e) {
    const s = y(this.parser, t, this.name);
    if (s === null) return Promise.resolve();
    const n = [];
    e.specularIntensity = s.specularFactor !== void 0 ? s.specularFactor : 1, s.specularTexture !== void 0 && n.push(this.parser.assignTexture(e, "specularIntensityMap", s.specularTexture));
    const r = s.specularColorFactor || [1, 1, 1];
    return e.specularColor = new k().setRGB(r[0], r[1], r[2], w), s.specularColorTexture !== void 0 && n.push(this.parser.assignTexture(e, "specularColorMap", s.specularColorTexture, U)), Promise.all(n);
  }
}
class yt {
  constructor(t) {
    this.parser = t, this.name = g.EXT_MATERIALS_BUMP;
  }
  getMaterialType(t) {
    return y(this.parser, t, this.name) !== null ? S : null;
  }
  extendMaterialParams(t, e) {
    const s = y(this.parser, t, this.name);
    if (s === null) return Promise.resolve();
    const n = [];
    return e.bumpScale = s.bumpFactor !== void 0 ? s.bumpFactor : 1, s.bumpTexture !== void 0 && n.push(this.parser.assignTexture(e, "bumpMap", s.bumpTexture)), Promise.all(n);
  }
}
class _t {
  constructor(t) {
    this.parser = t, this.name = g.KHR_MATERIALS_ANISOTROPY;
  }
  getMaterialType(t) {
    return y(this.parser, t, this.name) !== null ? S : null;
  }
  extendMaterialParams(t, e) {
    const s = y(this.parser, t, this.name);
    if (s === null) return Promise.resolve();
    const n = [];
    return s.anisotropyStrength !== void 0 && (e.anisotropy = s.anisotropyStrength), s.anisotropyRotation !== void 0 && (e.anisotropyRotation = s.anisotropyRotation), s.anisotropyTexture !== void 0 && n.push(this.parser.assignTexture(e, "anisotropyMap", s.anisotropyTexture)), Promise.all(n);
  }
}
class bt {
  constructor(t) {
    this.parser = t, this.name = g.KHR_TEXTURE_BASISU;
  }
  loadTexture(t) {
    const e = this.parser, s = e.json, n = s.textures[t];
    if (!n.extensions || !n.extensions[this.name]) return null;
    const r = n.extensions[this.name], i = e.options.ktx2Loader;
    if (!i) {
      if (s.extensionsRequired && s.extensionsRequired.indexOf(this.name) >= 0) throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      return null;
    }
    return e.loadTextureImage(t, r.source, i);
  }
}
class Mt {
  constructor(t) {
    this.parser = t, this.name = g.EXT_TEXTURE_WEBP;
  }
  loadTexture(t) {
    const e = this.name, s = this.parser, n = s.json, r = n.textures[t];
    if (!r.extensions || !r.extensions[e]) return null;
    const i = r.extensions[e], c = n.images[i.source];
    let o = s.textureLoader;
    if (c.uri) {
      const u = s.options.manager.getHandler(c.uri);
      u !== null && (o = u);
    }
    return s.loadTextureImage(t, i.source, o);
  }
}
class Lt {
  constructor(t) {
    this.parser = t, this.name = g.EXT_TEXTURE_AVIF;
  }
  loadTexture(t) {
    const e = this.name, s = this.parser, n = s.json, r = n.textures[t];
    if (!r.extensions || !r.extensions[e]) return null;
    const i = r.extensions[e], c = n.images[i.source];
    let o = s.textureLoader;
    if (c.uri) {
      const u = s.options.manager.getHandler(c.uri);
      u !== null && (o = u);
    }
    return s.loadTextureImage(t, i.source, o);
  }
}
class ce {
  constructor(t, e) {
    this.name = e, this.parser = t;
  }
  loadBufferView(t) {
    const e = this.parser.json, s = e.bufferViews[t];
    if (s.extensions && s.extensions[this.name]) {
      const n = s.extensions[this.name], r = this.parser.getDependency("buffer", n.buffer), i = this.parser.options.meshoptDecoder;
      if (!i || !i.supported) {
        if (e.extensionsRequired && e.extensionsRequired.indexOf(this.name) >= 0) throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        return null;
      }
      return r.then(function(c) {
        const o = n.byteOffset || 0, u = n.byteLength || 0, a = n.count, l = n.byteStride, h = new Uint8Array(c, o, u);
        return i.decodeGltfBufferAsync ? i.decodeGltfBufferAsync(a, l, h, n.mode, n.filter).then(function(d) {
          return d.buffer;
        }) : i.ready.then(function() {
          const d = new ArrayBuffer(a * l);
          return i.decodeGltfBuffer(new Uint8Array(d), a, l, h, n.mode, n.filter), d;
        });
      });
    } else return null;
  }
}
class St {
  constructor(t) {
    this.name = g.EXT_MESH_GPU_INSTANCING, this.parser = t;
  }
  createNodeMesh(t) {
    const e = this.parser.json, s = e.nodes[t];
    if (!s.extensions || !s.extensions[this.name] || s.mesh === void 0) return null;
    const n = e.meshes[s.mesh];
    for (const u of n.primitives) if (u.mode !== b.TRIANGLES && u.mode !== b.TRIANGLE_STRIP && u.mode !== b.TRIANGLE_FAN && u.mode !== void 0) return null;
    const i = s.extensions[this.name].attributes, c = [], o = {};
    for (const u in i) c.push(this.parser.getDependency("accessor", i[u]).then((a) => (o[u] = a, o[u])));
    return c.length < 1 ? null : (c.push(this.parser.createNodeMesh(t)), Promise.all(c).then((u) => {
      const a = u.pop(), l = a.isGroup ? a.children : [a], h = u[0].count, d = [];
      for (const p of l) {
        const T = new K(), m = new C(), R = new Te(), x = new C(1, 1, 1), A = new Oe(p.geometry, p.material, h);
        for (let E = 0; E < h; E++) o.TRANSLATION && m.fromBufferAttribute(o.TRANSLATION, E), o.ROTATION && R.fromBufferAttribute(o.ROTATION, E), o.SCALE && x.fromBufferAttribute(o.SCALE, E), A.setMatrixAt(E, T.compose(m, R, x));
        for (const E in o) if (E === "_COLOR_0") {
          const _ = o[E];
          A.instanceColor = new Ce(_.array, _.itemSize, _.normalized);
        } else E !== "TRANSLATION" && E !== "ROTATION" && E !== "SCALE" && p.geometry.setAttribute(E, o[E]);
        Re.prototype.copy.call(A, p), this.parser.assignFinalMaterial(A), d.push(A);
      }
      return a.isGroup ? (a.clear(), a.add(...d), a) : d[0];
    }));
  }
}
const be = "glTF", G = 12, ue = { JSON: 1313821514, BIN: 5130562 };
class wt {
  constructor(t) {
    this.name = g.KHR_BINARY_GLTF, this.content = null, this.body = null;
    const e = new DataView(t, 0, G), s = new TextDecoder();
    if (this.header = { magic: s.decode(new Uint8Array(t.slice(0, 4))), version: e.getUint32(4, true), length: e.getUint32(8, true) }, this.header.magic !== be) throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    if (this.header.version < 2) throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    const n = this.header.length - G, r = new DataView(t, G);
    let i = 0;
    for (; i < n; ) {
      const c = r.getUint32(i, true);
      i += 4;
      const o = r.getUint32(i, true);
      if (i += 4, o === ue.JSON) {
        const u = new Uint8Array(t, G + i, c);
        this.content = s.decode(u);
      } else if (o === ue.BIN) {
        const u = G + i;
        this.body = t.slice(u, u + c);
      }
      i += c;
    }
    if (this.content === null) throw new Error("THREE.GLTFLoader: JSON content not found.");
  }
}
class It {
  constructor(t, e) {
    if (!e) throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    this.name = g.KHR_DRACO_MESH_COMPRESSION, this.json = t, this.dracoLoader = e, this.dracoLoader.preload();
  }
  decodePrimitive(t, e) {
    const s = this.json, n = this.dracoLoader, r = t.extensions[this.name].bufferView, i = t.extensions[this.name].attributes, c = {}, o = {}, u = {};
    for (const a in i) {
      const l = $[a] || a.toLowerCase();
      c[l] = i[a];
    }
    for (const a in t.attributes) {
      const l = $[a] || a.toLowerCase();
      if (i[a] !== void 0) {
        const h = s.accessors[t.attributes[a]], d = P[h.componentType];
        u[l] = d.name, o[l] = h.normalized === true;
      }
    }
    return e.getDependency("bufferView", r).then(function(a) {
      return new Promise(function(l, h) {
        n.decodeDracoFile(a, function(d) {
          for (const p in d.attributes) {
            const T = d.attributes[p], m = o[p];
            m !== void 0 && (T.normalized = m);
          }
          l(d);
        }, c, u, w, h);
      });
    });
  }
}
class Nt {
  constructor() {
    this.name = g.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(t, e) {
    return (e.texCoord === void 0 || e.texCoord === t.channel) && e.offset === void 0 && e.rotation === void 0 && e.scale === void 0 || (t = t.clone(), e.texCoord !== void 0 && (t.channel = e.texCoord), e.offset !== void 0 && t.offset.fromArray(e.offset), e.rotation !== void 0 && (t.rotation = e.rotation), e.scale !== void 0 && t.repeat.fromArray(e.scale), t.needsUpdate = true), t;
  }
}
class Ot {
  constructor() {
    this.name = g.KHR_MESH_QUANTIZATION;
  }
}
class Me extends ot {
  constructor(t, e, s, n) {
    super(t, e, s, n);
  }
  copySampleValue_(t) {
    const e = this.resultBuffer, s = this.sampleValues, n = this.valueSize, r = t * n * 3 + n;
    for (let i = 0; i !== n; i++) e[i] = s[r + i];
    return e;
  }
  interpolate_(t, e, s, n) {
    const r = this.resultBuffer, i = this.sampleValues, c = this.valueSize, o = c * 2, u = c * 3, a = n - e, l = (s - e) / a, h = l * l, d = h * l, p = t * u, T = p - u, m = -2 * d + 3 * h, R = d - h, x = 1 - m, A = R - h + l;
    for (let E = 0; E !== c; E++) {
      const _ = i[T + E + c], I = i[T + E + o] * a, M = i[p + E + c], F = i[p + E] * a;
      r[E] = x * _ + A * I + m * M + R * F;
    }
    return r;
  }
}
const Ct = new Te();
class kt extends Me {
  interpolate_(t, e, s, n) {
    const r = super.interpolate_(t, e, s, n);
    return Ct.fromArray(r).normalize().toArray(r), r;
  }
}
const b = { POINTS: 0, LINES: 1, LINE_LOOP: 2, LINE_STRIP: 3, TRIANGLES: 4, TRIANGLE_STRIP: 5, TRIANGLE_FAN: 6 }, P = { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array }, le = { 9728: Ae, 9729: J, 9984: De, 9985: Ge, 9986: Fe, 9987: Ee }, fe = { 33071: Ue, 33648: ve, 10497: Z }, q = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT2: 4, MAT3: 9, MAT4: 16 }, $ = { POSITION: "position", NORMAL: "normal", TANGENT: "tangent", TEXCOORD_0: "uv", TEXCOORD_1: "uv1", TEXCOORD_2: "uv2", TEXCOORD_3: "uv3", COLOR_0: "color", WEIGHTS_0: "skinWeight", JOINTS_0: "skinIndex" }, N = { scale: "scale", translation: "position", rotation: "quaternion", weights: "morphTargetInfluences" }, Ht = { CUBICSPLINE: void 0, LINEAR: ye, STEP: st }, W = { OPAQUE: "OPAQUE", MASK: "MASK", BLEND: "BLEND" };
function Pt(f) {
  return f.DefaultMaterial === void 0 && (f.DefaultMaterial = new xe({ color: 16777215, emissive: 0, metalness: 1, roughness: 1, transparent: false, depthTest: true, side: it })), f.DefaultMaterial;
}
function O(f, t, e) {
  for (const s in e.extensions) f[s] === void 0 && (t.userData.gltfExtensions = t.userData.gltfExtensions || {}, t.userData.gltfExtensions[s] = e.extensions[s]);
}
function L(f, t) {
  t.extras !== void 0 && (typeof t.extras == "object" ? Object.assign(f.userData, t.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + t.extras));
}
function Ft(f, t, e) {
  let s = false, n = false, r = false;
  for (let u = 0, a = t.length; u < a; u++) {
    const l = t[u];
    if (l.POSITION !== void 0 && (s = true), l.NORMAL !== void 0 && (n = true), l.COLOR_0 !== void 0 && (r = true), s && n && r) break;
  }
  if (!s && !n && !r) return Promise.resolve(f);
  const i = [], c = [], o = [];
  for (let u = 0, a = t.length; u < a; u++) {
    const l = t[u];
    if (s) {
      const h = l.POSITION !== void 0 ? e.getDependency("accessor", l.POSITION) : f.attributes.position;
      i.push(h);
    }
    if (n) {
      const h = l.NORMAL !== void 0 ? e.getDependency("accessor", l.NORMAL) : f.attributes.normal;
      c.push(h);
    }
    if (r) {
      const h = l.COLOR_0 !== void 0 ? e.getDependency("accessor", l.COLOR_0) : f.attributes.color;
      o.push(h);
    }
  }
  return Promise.all([Promise.all(i), Promise.all(c), Promise.all(o)]).then(function(u) {
    const a = u[0], l = u[1], h = u[2];
    return s && (f.morphAttributes.position = a), n && (f.morphAttributes.normal = l), r && (f.morphAttributes.color = h), f.morphTargetsRelative = true, f;
  });
}
function Gt(f, t) {
  if (f.updateMorphTargets(), t.weights !== void 0) for (let e = 0, s = t.weights.length; e < s; e++) f.morphTargetInfluences[e] = t.weights[e];
  if (t.extras && Array.isArray(t.extras.targetNames)) {
    const e = t.extras.targetNames;
    if (f.morphTargetInfluences.length === e.length) {
      f.morphTargetDictionary = {};
      for (let s = 0, n = e.length; s < n; s++) f.morphTargetDictionary[e[s]] = s;
    } else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
  }
}
function Dt(f) {
  let t;
  const e = f.extensions && f.extensions[g.KHR_DRACO_MESH_COMPRESSION];
  if (e ? t = "draco:" + e.bufferView + ":" + e.indices + ":" + Y(e.attributes) : t = f.indices + ":" + Y(f.attributes) + ":" + f.mode, f.targets !== void 0) for (let s = 0, n = f.targets.length; s < n; s++) t += ":" + Y(f.targets[s]);
  return t;
}
function Y(f) {
  let t = "";
  const e = Object.keys(f).sort();
  for (let s = 0, n = e.length; s < n; s++) t += e[s] + ":" + f[e[s]] + ";";
  return t;
}
function ee(f) {
  switch (f) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function vt(f) {
  return f.search(/\.jpe?g($|\?)/i) > 0 || f.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : f.search(/\.webp($|\?)/i) > 0 || f.search(/^data\:image\/webp/) === 0 ? "image/webp" : f.search(/\.ktx2($|\?)/i) > 0 || f.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
const Ut = new K();
class Bt {
  constructor(t = {}, e = {}) {
    this.json = t, this.extensions = {}, this.plugins = {}, this.options = e, this.cache = new lt(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = { refs: {}, uses: {} }, this.cameraCache = { refs: {}, uses: {} }, this.lightCache = { refs: {}, uses: {} }, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
    let s = false, n = -1, r = false, i = -1;
    if (typeof navigator < "u" && typeof navigator.userAgent < "u") {
      const c = navigator.userAgent;
      s = /^((?!chrome|android).)*safari/i.test(c) === true;
      const o = c.match(/Version\/(\d+)/);
      n = s && o ? parseInt(o[1], 10) : -1, r = c.indexOf("Firefox") > -1, i = r ? c.match(/Firefox\/([0-9]+)\./)[1] : -1;
    }
    typeof createImageBitmap > "u" || s && n < 17 || r && i < 98 ? this.textureLoader = new ke(this.options.manager) : this.textureLoader = new He(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new me(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(true);
  }
  setExtensions(t) {
    this.extensions = t;
  }
  setPlugins(t) {
    this.plugins = t;
  }
  parse(t, e) {
    const s = this, n = this.json, r = this.extensions;
    this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(i) {
      return i._markDefs && i._markDefs();
    }), Promise.all(this._invokeAll(function(i) {
      return i.beforeRoot && i.beforeRoot();
    })).then(function() {
      return Promise.all([s.getDependencies("scene"), s.getDependencies("animation"), s.getDependencies("camera")]);
    }).then(function(i) {
      const c = { scene: i[0][n.scene || 0], scenes: i[0], animations: i[1], cameras: i[2], asset: n.asset, parser: s, userData: {} };
      return O(r, c, n), L(c, n), Promise.all(s._invokeAll(function(o) {
        return o.afterRoot && o.afterRoot(c);
      })).then(function() {
        for (const o of c.scenes) o.updateMatrixWorld();
        t(c);
      });
    }).catch(e);
  }
  _markDefs() {
    const t = this.json.nodes || [], e = this.json.skins || [], s = this.json.meshes || [];
    for (let n = 0, r = e.length; n < r; n++) {
      const i = e[n].joints;
      for (let c = 0, o = i.length; c < o; c++) t[i[c]].isBone = true;
    }
    for (let n = 0, r = t.length; n < r; n++) {
      const i = t[n];
      i.mesh !== void 0 && (this._addNodeRef(this.meshCache, i.mesh), i.skin !== void 0 && (s[i.mesh].isSkinnedMesh = true)), i.camera !== void 0 && this._addNodeRef(this.cameraCache, i.camera);
    }
  }
  _addNodeRef(t, e) {
    e !== void 0 && (t.refs[e] === void 0 && (t.refs[e] = t.uses[e] = 0), t.refs[e]++);
  }
  _getNodeRef(t, e, s) {
    if (t.refs[e] <= 1) return s;
    const n = s.clone(), r = (i, c) => {
      const o = this.associations.get(i);
      o != null && this.associations.set(c, o);
      for (const [u, a] of i.children.entries()) r(a, c.children[u]);
    };
    return r(s, n), n.name += "_instance_" + t.uses[e]++, n;
  }
  _invokeOne(t) {
    const e = Object.values(this.plugins);
    e.push(this);
    for (let s = 0; s < e.length; s++) {
      const n = t(e[s]);
      if (n) return n;
    }
    return null;
  }
  _invokeAll(t) {
    const e = Object.values(this.plugins);
    e.unshift(this);
    const s = [];
    for (let n = 0; n < e.length; n++) {
      const r = t(e[n]);
      r && s.push(r);
    }
    return s;
  }
  getDependency(t, e) {
    const s = t + ":" + e;
    let n = this.cache.get(s);
    if (!n) {
      switch (t) {
        case "scene":
          n = this.loadScene(e);
          break;
        case "node":
          n = this._invokeOne(function(r) {
            return r.loadNode && r.loadNode(e);
          });
          break;
        case "mesh":
          n = this._invokeOne(function(r) {
            return r.loadMesh && r.loadMesh(e);
          });
          break;
        case "accessor":
          n = this.loadAccessor(e);
          break;
        case "bufferView":
          n = this._invokeOne(function(r) {
            return r.loadBufferView && r.loadBufferView(e);
          });
          break;
        case "buffer":
          n = this.loadBuffer(e);
          break;
        case "material":
          n = this._invokeOne(function(r) {
            return r.loadMaterial && r.loadMaterial(e);
          });
          break;
        case "texture":
          n = this._invokeOne(function(r) {
            return r.loadTexture && r.loadTexture(e);
          });
          break;
        case "skin":
          n = this.loadSkin(e);
          break;
        case "animation":
          n = this._invokeOne(function(r) {
            return r.loadAnimation && r.loadAnimation(e);
          });
          break;
        case "camera":
          n = this.loadCamera(e);
          break;
        default:
          if (n = this._invokeOne(function(r) {
            return r != this && r.getDependency && r.getDependency(t, e);
          }), !n) throw new Error("Unknown type: " + t);
          break;
      }
      this.cache.add(s, n);
    }
    return n;
  }
  getDependencies(t) {
    let e = this.cache.get(t);
    if (!e) {
      const s = this, n = this.json[t + (t === "mesh" ? "es" : "s")] || [];
      e = Promise.all(n.map(function(r, i) {
        return s.getDependency(t, i);
      })), this.cache.add(t, e);
    }
    return e;
  }
  loadBuffer(t) {
    const e = this.json.buffers[t], s = this.fileLoader;
    if (e.type && e.type !== "arraybuffer") throw new Error("THREE.GLTFLoader: " + e.type + " buffer type is not supported.");
    if (e.uri === void 0 && t === 0) return Promise.resolve(this.extensions[g.KHR_BINARY_GLTF].body);
    const n = this.options;
    return new Promise(function(r, i) {
      s.load(v.resolveURL(e.uri, n.path), r, void 0, function() {
        i(new Error('THREE.GLTFLoader: Failed to load buffer "' + e.uri + '".'));
      });
    });
  }
  loadBufferView(t) {
    const e = this.json.bufferViews[t];
    return this.getDependency("buffer", e.buffer).then(function(s) {
      const n = e.byteLength || 0, r = e.byteOffset || 0;
      return s.slice(r, r + n);
    });
  }
  loadAccessor(t) {
    const e = this, s = this.json, n = this.json.accessors[t];
    if (n.bufferView === void 0 && n.sparse === void 0) {
      const i = q[n.type], c = P[n.componentType], o = n.normalized === true, u = new c(n.count * i);
      return Promise.resolve(new B(u, i, o));
    }
    const r = [];
    return n.bufferView !== void 0 ? r.push(this.getDependency("bufferView", n.bufferView)) : r.push(null), n.sparse !== void 0 && (r.push(this.getDependency("bufferView", n.sparse.indices.bufferView)), r.push(this.getDependency("bufferView", n.sparse.values.bufferView))), Promise.all(r).then(function(i) {
      const c = i[0], o = q[n.type], u = P[n.componentType], a = u.BYTES_PER_ELEMENT, l = a * o, h = n.byteOffset || 0, d = n.bufferView !== void 0 ? s.bufferViews[n.bufferView].byteStride : void 0, p = n.normalized === true;
      let T, m;
      if (d && d !== l) {
        const R = Math.floor(h / d), x = "InterleavedBuffer:" + n.bufferView + ":" + n.componentType + ":" + R + ":" + n.count;
        let A = e.cache.get(x);
        A || (T = new u(c, R * d, n.count * d / a), A = new Pe(T, d / a), e.cache.add(x, A)), m = new rt(A, o, h % d / a, p);
      } else c === null ? T = new u(n.count * o) : T = new u(c, h, n.count * o), m = new B(T, o, p);
      if (n.sparse !== void 0) {
        const R = q.SCALAR, x = P[n.sparse.indices.componentType], A = n.sparse.indices.byteOffset || 0, E = n.sparse.values.byteOffset || 0, _ = new x(i[1], A, n.sparse.count * R), I = new u(i[2], E, n.sparse.count * o);
        c !== null && (m = new B(m.array.slice(), m.itemSize, m.normalized)), m.normalized = false;
        for (let M = 0, F = _.length; M < F; M++) {
          const H = _[M];
          if (m.setX(H, I[M * o]), o >= 2 && m.setY(H, I[M * o + 1]), o >= 3 && m.setZ(H, I[M * o + 2]), o >= 4 && m.setW(H, I[M * o + 3]), o >= 5) throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
        m.normalized = p;
      }
      return m;
    });
  }
  loadTexture(t) {
    const e = this.json, s = this.options, r = e.textures[t].source, i = e.images[r];
    let c = this.textureLoader;
    if (i.uri) {
      const o = s.manager.getHandler(i.uri);
      o !== null && (c = o);
    }
    return this.loadTextureImage(t, r, c);
  }
  loadTextureImage(t, e, s) {
    const n = this, r = this.json, i = r.textures[t], c = r.images[e], o = (c.uri || c.bufferView) + ":" + i.sampler;
    if (this.textureCache[o]) return this.textureCache[o];
    const u = this.loadImageSource(e, s).then(function(a) {
      a.flipY = false, a.name = i.name || c.name || "", a.name === "" && typeof c.uri == "string" && c.uri.startsWith("data:image/") === false && (a.name = c.uri);
      const h = (r.samplers || {})[i.sampler] || {};
      return a.magFilter = le[h.magFilter] || J, a.minFilter = le[h.minFilter] || Ee, a.wrapS = fe[h.wrapS] || Z, a.wrapT = fe[h.wrapT] || Z, a.generateMipmaps = !a.isCompressedTexture && a.minFilter !== Ae && a.minFilter !== J, n.associations.set(a, { textures: t }), a;
    }).catch(function() {
      return null;
    });
    return this.textureCache[o] = u, u;
  }
  loadImageSource(t, e) {
    const s = this, n = this.json, r = this.options;
    if (this.sourceCache[t] !== void 0) return this.sourceCache[t].then((l) => l.clone());
    const i = n.images[t], c = self.URL || self.webkitURL;
    let o = i.uri || "", u = false;
    if (i.bufferView !== void 0) o = s.getDependency("bufferView", i.bufferView).then(function(l) {
      u = true;
      const h = new Blob([l], { type: i.mimeType });
      return o = c.createObjectURL(h), o;
    });
    else if (i.uri === void 0) throw new Error("THREE.GLTFLoader: Image " + t + " is missing URI and bufferView");
    const a = Promise.resolve(o).then(function(l) {
      return new Promise(function(h, d) {
        let p = h;
        e.isImageBitmapLoader === true && (p = function(T) {
          const m = new te(T);
          m.needsUpdate = true, h(m);
        }), e.load(v.resolveURL(l, r.path), p, void 0, d);
      });
    }).then(function(l) {
      return u === true && c.revokeObjectURL(o), L(l, i), l.userData.mimeType = i.mimeType || vt(i.uri), l;
    }).catch(function(l) {
      throw console.error("THREE.GLTFLoader: Couldn't load texture", o), l;
    });
    return this.sourceCache[t] = a, a;
  }
  assignTexture(t, e, s, n) {
    const r = this;
    return this.getDependency("texture", s.index).then(function(i) {
      if (!i) return null;
      if (s.texCoord !== void 0 && s.texCoord > 0 && (i = i.clone(), i.channel = s.texCoord), r.extensions[g.KHR_TEXTURE_TRANSFORM]) {
        const c = s.extensions !== void 0 ? s.extensions[g.KHR_TEXTURE_TRANSFORM] : void 0;
        if (c) {
          const o = r.associations.get(i);
          i = r.extensions[g.KHR_TEXTURE_TRANSFORM].extendTexture(i, c), r.associations.set(i, o);
        }
      }
      return n !== void 0 && (i.colorSpace = n), t[e] = i, i;
    });
  }
  assignFinalMaterial(t) {
    const e = t.geometry;
    let s = t.material;
    const n = e.attributes.tangent === void 0, r = e.attributes.color !== void 0, i = e.attributes.normal === void 0;
    if (t.isPoints) {
      const c = "PointsMaterial:" + s.uuid;
      let o = this.cache.get(c);
      o || (o = new Be(), X.prototype.copy.call(o, s), o.color.copy(s.color), o.map = s.map, o.sizeAttenuation = false, this.cache.add(c, o)), s = o;
    } else if (t.isLine) {
      const c = "LineBasicMaterial:" + s.uuid;
      let o = this.cache.get(c);
      o || (o = new Ke(), X.prototype.copy.call(o, s), o.color.copy(s.color), o.map = s.map, this.cache.add(c, o)), s = o;
    }
    if (n || r || i) {
      let c = "ClonedMaterial:" + s.uuid + ":";
      n && (c += "derivative-tangents:"), r && (c += "vertex-colors:"), i && (c += "flat-shading:");
      let o = this.cache.get(c);
      o || (o = s.clone(), r && (o.vertexColors = true), i && (o.flatShading = true), n && (o.normalScale && (o.normalScale.y *= -1), o.clearcoatNormalScale && (o.clearcoatNormalScale.y *= -1)), this.cache.add(c, o), this.associations.set(o, this.associations.get(s))), s = o;
    }
    t.material = s;
  }
  getMaterialType() {
    return xe;
  }
  loadMaterial(t) {
    const e = this, s = this.json, n = this.extensions, r = s.materials[t];
    let i;
    const c = {}, o = r.extensions || {}, u = [];
    if (o[g.KHR_MATERIALS_UNLIT]) {
      const l = n[g.KHR_MATERIALS_UNLIT];
      i = l.getMaterialType(), u.push(l.extendParams(c, r, e));
    } else {
      const l = r.pbrMetallicRoughness || {};
      if (c.color = new k(1, 1, 1), c.opacity = 1, Array.isArray(l.baseColorFactor)) {
        const h = l.baseColorFactor;
        c.color.setRGB(h[0], h[1], h[2], w), c.opacity = h[3];
      }
      l.baseColorTexture !== void 0 && u.push(e.assignTexture(c, "map", l.baseColorTexture, U)), c.metalness = l.metallicFactor !== void 0 ? l.metallicFactor : 1, c.roughness = l.roughnessFactor !== void 0 ? l.roughnessFactor : 1, l.metallicRoughnessTexture !== void 0 && (u.push(e.assignTexture(c, "metalnessMap", l.metallicRoughnessTexture)), u.push(e.assignTexture(c, "roughnessMap", l.metallicRoughnessTexture))), i = this._invokeOne(function(h) {
        return h.getMaterialType && h.getMaterialType(t);
      }), u.push(Promise.all(this._invokeAll(function(h) {
        return h.extendMaterialParams && h.extendMaterialParams(t, c);
      })));
    }
    r.doubleSided === true && (c.side = je);
    const a = r.alphaMode || W.OPAQUE;
    if (a === W.BLEND ? (c.transparent = true, c.depthWrite = false) : (c.transparent = false, a === W.MASK && (c.alphaTest = r.alphaCutoff !== void 0 ? r.alphaCutoff : 0.5)), r.normalTexture !== void 0 && i !== D && (u.push(e.assignTexture(c, "normalMap", r.normalTexture)), c.normalScale = new ge(1, 1), r.normalTexture.scale !== void 0)) {
      const l = r.normalTexture.scale;
      c.normalScale.set(l, l);
    }
    if (r.occlusionTexture !== void 0 && i !== D && (u.push(e.assignTexture(c, "aoMap", r.occlusionTexture)), r.occlusionTexture.strength !== void 0 && (c.aoMapIntensity = r.occlusionTexture.strength)), r.emissiveFactor !== void 0 && i !== D) {
      const l = r.emissiveFactor;
      c.emissive = new k().setRGB(l[0], l[1], l[2], w);
    }
    return r.emissiveTexture !== void 0 && i !== D && u.push(e.assignTexture(c, "emissiveMap", r.emissiveTexture, U)), Promise.all(u).then(function() {
      const l = new i(c);
      return r.name && (l.name = r.name), L(l, r), e.associations.set(l, { materials: t }), r.extensions && O(n, l, r), l;
    });
  }
  createUniqueName(t) {
    const e = Ve.sanitizeNodeName(t || "");
    return e in this.nodeNamesUsed ? e + "_" + ++this.nodeNamesUsed[e] : (this.nodeNamesUsed[e] = 0, e);
  }
  loadGeometries(t) {
    const e = this, s = this.extensions, n = this.primitiveCache;
    function r(c) {
      return s[g.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(c, e).then(function(o) {
        return he(o, c, e);
      });
    }
    const i = [];
    for (let c = 0, o = t.length; c < o; c++) {
      const u = t[c], a = Dt(u), l = n[a];
      if (l) i.push(l.promise);
      else {
        let h;
        u.extensions && u.extensions[g.KHR_DRACO_MESH_COMPRESSION] ? h = r(u) : h = he(new de(), u, e), n[a] = { primitive: u, promise: h }, i.push(h);
      }
    }
    return Promise.all(i);
  }
  loadMesh(t) {
    const e = this, s = this.json, n = this.extensions, r = s.meshes[t], i = r.primitives, c = [];
    for (let o = 0, u = i.length; o < u; o++) {
      const a = i[o].material === void 0 ? Pt(this.cache) : this.getDependency("material", i[o].material);
      c.push(a);
    }
    return c.push(e.loadGeometries(i)), Promise.all(c).then(function(o) {
      const u = o.slice(0, o.length - 1), a = o[o.length - 1], l = [];
      for (let d = 0, p = a.length; d < p; d++) {
        const T = a[d], m = i[d];
        let R;
        const x = u[d];
        if (m.mode === b.TRIANGLES || m.mode === b.TRIANGLE_STRIP || m.mode === b.TRIANGLE_FAN || m.mode === void 0) R = r.isSkinnedMesh === true ? new Xe(T, x) : new ze(T, x), R.isSkinnedMesh === true && R.normalizeSkinWeights(), m.mode === b.TRIANGLE_STRIP ? R.geometry = ae(R.geometry, pe) : m.mode === b.TRIANGLE_FAN && (R.geometry = ae(R.geometry, Q));
        else if (m.mode === b.LINES) R = new qe(T, x);
        else if (m.mode === b.LINE_STRIP) R = new We(T, x);
        else if (m.mode === b.LINE_LOOP) R = new Ye(T, x);
        else if (m.mode === b.POINTS) R = new Qe(T, x);
        else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + m.mode);
        Object.keys(R.geometry.morphAttributes).length > 0 && Gt(R, r), R.name = e.createUniqueName(r.name || "mesh_" + t), L(R, r), m.extensions && O(n, R, m), e.assignFinalMaterial(R), l.push(R);
      }
      for (let d = 0, p = l.length; d < p; d++) e.associations.set(l[d], { meshes: t, primitives: d });
      if (l.length === 1) return r.extensions && O(n, l[0], r), l[0];
      const h = new z();
      r.extensions && O(n, h, r), e.associations.set(h, { meshes: t });
      for (let d = 0, p = l.length; d < p; d++) h.add(l[d]);
      return h;
    });
  }
  loadCamera(t) {
    let e;
    const s = this.json.cameras[t], n = s[s.type];
    if (!n) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    return s.type === "perspective" ? e = new Je(Ze.radToDeg(n.yfov), n.aspectRatio || 1, n.znear || 1, n.zfar || 2e6) : s.type === "orthographic" && (e = new $e(-n.xmag, n.xmag, n.ymag, -n.ymag, n.znear, n.zfar)), s.name && (e.name = this.createUniqueName(s.name)), L(e, s), Promise.resolve(e);
  }
  loadSkin(t) {
    const e = this.json.skins[t], s = [];
    for (let n = 0, r = e.joints.length; n < r; n++) s.push(this._loadNodeShallow(e.joints[n]));
    return e.inverseBindMatrices !== void 0 ? s.push(this.getDependency("accessor", e.inverseBindMatrices)) : s.push(null), Promise.all(s).then(function(n) {
      const r = n.pop(), i = n, c = [], o = [];
      for (let u = 0, a = i.length; u < a; u++) {
        const l = i[u];
        if (l) {
          c.push(l);
          const h = new K();
          r !== null && h.fromArray(r.array, u * 16), o.push(h);
        } else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', e.joints[u]);
      }
      return new et(c, o);
    });
  }
  loadAnimation(t) {
    const e = this.json, s = this, n = e.animations[t], r = n.name ? n.name : "animation_" + t, i = [], c = [], o = [], u = [], a = [];
    for (let l = 0, h = n.channels.length; l < h; l++) {
      const d = n.channels[l], p = n.samplers[d.sampler], T = d.target, m = T.node, R = n.parameters !== void 0 ? n.parameters[p.input] : p.input, x = n.parameters !== void 0 ? n.parameters[p.output] : p.output;
      T.node !== void 0 && (i.push(this.getDependency("node", m)), c.push(this.getDependency("accessor", R)), o.push(this.getDependency("accessor", x)), u.push(p), a.push(T));
    }
    return Promise.all([Promise.all(i), Promise.all(c), Promise.all(o), Promise.all(u), Promise.all(a)]).then(function(l) {
      const h = l[0], d = l[1], p = l[2], T = l[3], m = l[4], R = [];
      for (let A = 0, E = h.length; A < E; A++) {
        const _ = h[A], I = d[A], M = p[A], F = T[A], H = m[A];
        if (_ === void 0) continue;
        _.updateMatrix && _.updateMatrix();
        const j = s._createAnimationTracks(_, I, M, F, H);
        if (j) for (let V = 0; V < j.length; V++) R.push(j[V]);
      }
      const x = new tt(r, void 0, R);
      return L(x, n), x;
    });
  }
  createNodeMesh(t) {
    const e = this.json, s = this, n = e.nodes[t];
    return n.mesh === void 0 ? null : s.getDependency("mesh", n.mesh).then(function(r) {
      const i = s._getNodeRef(s.meshCache, n.mesh, r);
      return n.weights !== void 0 && i.traverse(function(c) {
        if (c.isMesh) for (let o = 0, u = n.weights.length; o < u; o++) c.morphTargetInfluences[o] = n.weights[o];
      }), i;
    });
  }
  loadNode(t) {
    const e = this.json, s = this, n = e.nodes[t], r = s._loadNodeShallow(t), i = [], c = n.children || [];
    for (let u = 0, a = c.length; u < a; u++) i.push(s.getDependency("node", c[u]));
    const o = n.skin === void 0 ? Promise.resolve(null) : s.getDependency("skin", n.skin);
    return Promise.all([r, Promise.all(i), o]).then(function(u) {
      const a = u[0], l = u[1], h = u[2];
      h !== null && a.traverse(function(d) {
        d.isSkinnedMesh && d.bind(h, Ut);
      });
      for (let d = 0, p = l.length; d < p; d++) a.add(l[d]);
      if (a.userData.pivot !== void 0 && l.length > 0) {
        const d = a.userData.pivot, p = l[0];
        a.pivot = new C().fromArray(d), a.position.x -= d[0], a.position.y -= d[1], a.position.z -= d[2], p.position.set(0, 0, 0), delete a.userData.pivot;
      }
      return a;
    });
  }
  _loadNodeShallow(t) {
    const e = this.json, s = this.extensions, n = this;
    if (this.nodeCache[t] !== void 0) return this.nodeCache[t];
    const r = e.nodes[t], i = r.name ? n.createUniqueName(r.name) : "", c = [], o = n._invokeOne(function(u) {
      return u.createNodeMesh && u.createNodeMesh(t);
    });
    return o && c.push(o), r.camera !== void 0 && c.push(n.getDependency("camera", r.camera).then(function(u) {
      return n._getNodeRef(n.cameraCache, r.camera, u);
    })), n._invokeAll(function(u) {
      return u.createNodeAttachment && u.createNodeAttachment(t);
    }).forEach(function(u) {
      c.push(u);
    }), this.nodeCache[t] = Promise.all(c).then(function(u) {
      let a;
      if (r.isBone === true ? a = new nt() : u.length > 1 ? a = new z() : u.length === 1 ? a = u[0] : a = new Re(), a !== u[0]) for (let l = 0, h = u.length; l < h; l++) a.add(u[l]);
      if (r.name && (a.userData.name = r.name, a.name = i), L(a, r), r.extensions && O(s, a, r), r.matrix !== void 0) {
        const l = new K();
        l.fromArray(r.matrix), a.applyMatrix4(l);
      } else r.translation !== void 0 && a.position.fromArray(r.translation), r.rotation !== void 0 && a.quaternion.fromArray(r.rotation), r.scale !== void 0 && a.scale.fromArray(r.scale);
      if (!n.associations.has(a)) n.associations.set(a, {});
      else if (r.mesh !== void 0 && n.meshCache.refs[r.mesh] > 1) {
        const l = n.associations.get(a);
        n.associations.set(a, { ...l });
      }
      return n.associations.get(a).nodes = t, a;
    }), this.nodeCache[t];
  }
  loadScene(t) {
    const e = this.extensions, s = this.json.scenes[t], n = this, r = new z();
    s.name && (r.name = n.createUniqueName(s.name)), L(r, s), s.extensions && O(e, r, s);
    const i = s.nodes || [], c = [];
    for (let o = 0, u = i.length; o < u; o++) c.push(n.getDependency("node", i[o]));
    return Promise.all(c).then(function(o) {
      for (let a = 0, l = o.length; a < l; a++) {
        const h = o[a];
        h.parent !== null ? r.add(ut(h)) : r.add(h);
      }
      const u = (a) => {
        const l = /* @__PURE__ */ new Map();
        for (const [h, d] of n.associations) (h instanceof X || h instanceof te) && l.set(h, d);
        return a.traverse((h) => {
          const d = n.associations.get(h);
          d != null && l.set(h, d);
        }), l;
      };
      return n.associations = u(r), r;
    });
  }
  _createAnimationTracks(t, e, s, n, r) {
    const i = [], c = t.name ? t.name : t.uuid, o = [];
    N[r.path] === N.weights ? t.traverse(function(h) {
      h.morphTargetInfluences && o.push(h.name ? h.name : h.uuid);
    }) : o.push(c);
    let u;
    switch (N[r.path]) {
      case N.weights:
        u = se;
        break;
      case N.rotation:
        u = re;
        break;
      case N.translation:
      case N.scale:
        u = ne;
        break;
      default:
        switch (s.itemSize) {
          case 1:
            u = se;
            break;
          case 2:
          case 3:
          default:
            u = ne;
            break;
        }
        break;
    }
    const a = n.interpolation !== void 0 ? Ht[n.interpolation] : ye, l = this._getArrayFromAccessor(s);
    for (let h = 0, d = o.length; h < d; h++) {
      const p = new u(o[h] + "." + N[r.path], e.array, l, a);
      n.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(p), i.push(p);
    }
    return i;
  }
  _getArrayFromAccessor(t) {
    let e = t.array;
    if (t.normalized) {
      const s = ee(e.constructor), n = new Float32Array(e.length);
      for (let r = 0, i = e.length; r < i; r++) n[r] = e[r] * s;
      e = n;
    }
    return e;
  }
  _createCubicSplineTrackInterpolant(t) {
    t.createInterpolant = function(s) {
      const n = this instanceof re ? kt : Me;
      return new n(this.times, this.values, this.getValueSize() / 3, s);
    }, t.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
  }
}
function Kt(f, t, e) {
  const s = t.attributes, n = new at();
  if (s.POSITION !== void 0) {
    const c = e.json.accessors[s.POSITION], o = c.min, u = c.max;
    if (o !== void 0 && u !== void 0) {
      if (n.set(new C(o[0], o[1], o[2]), new C(u[0], u[1], u[2])), c.normalized) {
        const a = ee(P[c.componentType]);
        n.min.multiplyScalar(a), n.max.multiplyScalar(a);
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else return;
  const r = t.targets;
  if (r !== void 0) {
    const c = new C(), o = new C();
    for (let u = 0, a = r.length; u < a; u++) {
      const l = r[u];
      if (l.POSITION !== void 0) {
        const h = e.json.accessors[l.POSITION], d = h.min, p = h.max;
        if (d !== void 0 && p !== void 0) {
          if (o.setX(Math.max(Math.abs(d[0]), Math.abs(p[0]))), o.setY(Math.max(Math.abs(d[1]), Math.abs(p[1]))), o.setZ(Math.max(Math.abs(d[2]), Math.abs(p[2]))), h.normalized) {
            const T = ee(P[h.componentType]);
            o.multiplyScalar(T);
          }
          c.max(o);
        } else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      }
    }
    n.expandByVector(c);
  }
  f.boundingBox = n;
  const i = new ct();
  n.getCenter(i.center), i.radius = n.min.distanceTo(n.max) / 2, f.boundingSphere = i;
}
function he(f, t, e) {
  const s = t.attributes, n = [];
  function r(i, c) {
    return e.getDependency("accessor", i).then(function(o) {
      f.setAttribute(c, o);
    });
  }
  for (const i in s) {
    const c = $[i] || i.toLowerCase();
    c in f.attributes || n.push(r(s[i], c));
  }
  if (t.indices !== void 0 && !f.index) {
    const i = e.getDependency("accessor", t.indices).then(function(c) {
      f.setIndex(c);
    });
    n.push(i);
  }
  return ie.workingColorSpace !== w && "COLOR_0" in s && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${ie.workingColorSpace}" not supported.`), L(f, t), Kt(f, t, e), Promise.all(n).then(function() {
    return t.targets !== void 0 ? Ft(f, t.targets, e) : f;
  });
}
export {
  Xt as G,
  Vt as m
};
