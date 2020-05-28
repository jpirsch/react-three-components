
import React, { Component } from 'react'
import '../App.css'
import * as THREE from 'three'
import { HandleControl } from '../ThreeUtils/HandleControl.js';

class PointerControl extends Component {
	constructor(props){
		super(props)
		this.makeScene = this.makeScene.bind(this)
	}
	componentDidMount() {
			this.makeScene()
	}
	componentDidUpdate() {
		this.makeScene()
	}
	makeScene() {
	var camera, scene, renderer, hc;
	var objects = [];
	var raycaster;

	var canJump = false;
	var vertex = new THREE.Vector3();
	var color = new THREE.Color();

	var init = function (refs) {
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
		camera.position.y = 10;
		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xffffff );
		scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
		var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
		light.position.set( 0.5, 1, 0.75 );
		scene.add( light );

		hc = new HandleControl( camera, refs.node, refs.instructions, refs.blocker );
		scene.add( hc.getObject() );
		raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
		// floor
		var floorGeometry = new THREE.PlaneBufferGeometry( 200, 200, 10, 10 );
		floorGeometry.rotateX( - Math.PI / 2 );
		// vertex displacement
		var position = floorGeometry.attributes.position;
		for ( var i = 0, l = position.count; i < l; i ++ ) {
			vertex.fromBufferAttribute( position, i );
			vertex.x += Math.random() * 20 - 10;
			vertex.y += Math.random() * 10;
			vertex.z += Math.random() * 20 - 10;
			position.setXYZ( i, vertex.x, vertex.y, vertex.z );
		}
		floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices
		position = floorGeometry.attributes.position;
		var colors = [];
		for ( var i = 0, l = position.count; i < l; i ++ ) {
			color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			colors.push( color.r, color.g, color.b );
		}
		floorGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
		var floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: true } );
		var floor = new THREE.Mesh( floorGeometry, floorMaterial );
		scene.add( floor );	
		// objects
		var boxGeometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
		boxGeometry = boxGeometry.toNonIndexed(); // ensure each face has unique vertices
		position = boxGeometry.attributes.position;
		colors = [];
		for ( var i = 0, l = position.count; i < l; i ++ ) {
			color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			colors.push( color.r, color.g, color.b );
		}
		boxGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
		for ( var i = 0; i < 500; i ++ ) {
			var boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: true } );
			boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
			var box = new THREE.Mesh( boxGeometry, boxMaterial );
			box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
			box.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
			box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;
			scene.add( box );
			objects.push( box );
		}
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth - 100, window.innerHeight );
		refs.node.appendChild( renderer.domElement );
		window.addEventListener( 'resize', onWindowResize, false );
	}
	var onWindowResize = function () {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth - 100, window.innerHeight );
	}
	var animate = function () {
		requestAnimationFrame( animate );
		if ( hc.controls.isLocked === true ) {
			hc.update();
			raycaster.ray.origin.copy( hc.getObject().position );
			raycaster.ray.origin.y -= 10;
			var intersections = raycaster.intersectObjects( objects );
			var onObject = intersections.length > 0;
		}
		renderer.render( scene, camera );
	}

	init(this);
	animate();
	}
	render() {
		return (
			<div ref={node => this.node = node}>
				<div ref={blocker => this.blocker = blocker}>
					<div ref={instructions => this.instructions = instructions}>
			<span style={{fontSize: "36px"}}>Click to play</span>
				<br /><br />
				Move: WASD<br/>
				Jump: SPACE<br/>
				Look: MOUSE
				</div>
			</div>
		</div>
		);
	}
}

export default PointerControl;
