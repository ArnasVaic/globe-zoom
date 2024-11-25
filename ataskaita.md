== Tikslas

Padaryti priartinimą tam tikroje sferos vietoje.

== Naudotos technologijos

Pasiteklta WebGL technologija su Three.js biblioteka.

== Sprendimas

Priartinimas prie polio yra įvykdomas ganėtinai paprastai. Užtenka tik vienos kodo eilutės:

```glsl
vec2 zoom(vec2 uv) {
    return vec2(uv.x, pow(uv.y, u_zoom));
}
```

Dauguma sunkumų kyla norint priartinti kitose sferos taškuose. Tam atlikti visa tekstūra pasukama tam tikra ašimi.

Tam atlikti, toliau $uv$ koordinatės paverčiamos į sferinių koordinačių sistemą, kur $\phi$ nusako kampą nuo X, o $\theta$ nusako kampą nuo Y.

```glsl
float phi = 2.0 * PI * uv.x;
float theta = PI * (1.0 - uv.y);
```

Šios paverčiamos iš sprefinės koordinačių sistemo į Dekarto koordinačių sistemą, nusakoma vektoriu $(x, y, z)$.

```glsl
vec3 pos = sphericalToCartesian(phi, theta);
```

Turiant `pos` ir `pole` koordinates, jas visas pasukame:

```glsl
vec3 newPoleCartesian = sphericalToCartesian(pole.x, pole.y);
mat3 rotationMatrix = getRotationMatrix(newPoleCartesian);
vec3 rotatedPos = rotationMatrix * pos;
```

Paskutiniuse žingsniuose jos paverčiamos atgal į sferinę koordinačių sistemą:

```glsl
vec2 rotatedSpherical = cartesianToSpherical(rotatedPos);
```


o vėliau normalizuojamos į $uv$.

```glsl
vec2 newUv;
newUv.x = (rotatedSpherical.x / (2.0 * PI)) + 0.5; // Normalize longitude
newUv.y = 1.0 - rotatedSpherical.y / PI; // Normalize latitude
}
```

Paskutiniame žingsnyje, pozicijoje `uv` yra paemama spalva iš `newUv` koordinatės iš pateiktos tekstūros:

```glsl
FragColor = texture2D(u_texture, newUv);
```

== Rezultatai

== Priedai

= Komentarai

linijos priartintoje sferos vietoje turėtų būtų elipsė.
