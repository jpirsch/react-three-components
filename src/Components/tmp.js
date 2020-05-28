

import React, { Component } from 'react'
import '../App.css'
import * as THREE from 'three'
import { PointerLockControls } from '../ThreeUtils/PointerLockControls.js';
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const HandleControl = function ( camera, domElement, instructions, blocker ) {
	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.moveUp = false;
	this.moveDown = false;

	this.mouseLClick = false;
	this.mouseMClick = false;
	this.mouseRClick = false;

	this.velocity = new THREE.Vector3();
	this.direction = new THREE.Vector3();
	this.prevTime = performance.now();

	this.controls = new PointerLockControls( camera, domElement );
	var controls = this.controls;
  this.isLocked = this.controls.isLocked;

  this.getObject = function() {
		return this.controls.getObject();
	}

	// Toggle pointer lock on click on this element
	instructions.addEventListener( 'click', function () {
		controls.lock();
	}, false );

	this.controls.addEventListener( 'lock', function () {
		instructions.style.display = 'none';
		blocker.style.display = 'none';
	} );

	this.controls.addEventListener( 'unlock', function () {
		blocker.style.display = 'block';
		instructions.style.display = '';
	} );

	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				this.moveForward = true;
				break;
			case 37: // left
			case 65: // a
				this.moveLeft = true;
				break;
			case 40: // down
			case 83: // s
				this.moveBackward = true;
				break;
			case 39: // right
			case 68: // d
				this.moveRight = true;
				break;
			case 16: // shift
				this.moveDown = true;
				break;
			case 32: // space
				//if ( canJump === true ) velocity.y += 350;
				//canJump = false;
				this.moveUp = true;
				break;
		}
	};

	var onKeyUp = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				this.moveForward = false;
				break;
			case 37: // left
			case 65: // a
				this.moveLeft = false;
				break;
			case 40: // down
			case 83: // s
				this.moveBackward = false;
				break;
			case 39: // right
			case 68: // d
				this.moveRight = false;
				break;
			case 16: // shift
				this.moveDown = false;
				break;
			case 32: // space
				//if ( canJump === true ) velocity.y += 350;
				//canJump = false;
				this.moveUp = false;
				break;
		}
	};

	var onMouseDown = function ( event ) {
		console.log("click : "+event.button);
		switch ( event.button ) {
			case 0:
				this.mouseLClick = true;
				break;
			case 1:
				this.mouseMClick = true;
				break;
			case 2:
				this.mouseRClick = true;
				break;
		}
		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );
	}
	var onMouseMove = function ( event ) { }
	var onMouseUp = function ( event ) {
		switch ( event.button ) {
			case 0:
				this.mouseLClick = false;
				break;
			case 1:
				this.mouseMClick = false;
				break;
			case 2:
				this.mouseRClick = false;
				break;
			default:
		}
		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );
	}
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	document.addEventListener( 'mousedown', onMouseDown, false );
	this.update = function() {
//			console.log("in HandleControl update");
//  	this.isLocked = this.controls.isLocked;
			var time = performance.now();
			var delta = ( time - this.prevTime ) / 1000;
			var velocity = this.velocity;
			var direction = this.velocity;
			velocity.x -= velocity.x * 10.0 * delta;
			velocity.z -= velocity.z * 10.0 * delta;
			velocity.y -= velocity.y * 10.0 * delta;
//			velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
			direction.z = Number( this.moveForward ) - Number( this.moveBackward );
			direction.x = Number( this.moveRight ) - Number( this.moveLeft );
			direction.y = Number( this.moveDown ) - Number( this.moveUp );
			direction.normalize(); // this ensures consistent movements in all directions
			if ( this.moveForward || this.moveBackward ) velocity.z -= direction.z * 400.0 * delta;
			if ( this.moveLeft || this.moveRight ) velocity.x -= direction.x * 400.0 * delta;
		if ( this.moveUp || this.moveDown ) velocity.y -= direction.y * 400.0 * delta;
		if ( this.mouseLClick ) console.log("forward");//velocity.z -= 400 * delta;
		if ( this.mouseRClick ) velocity.z += 400 * delta;
			//if ( onObject === true ) {
			//	velocity.y = Math.max( 0, velocity.y );
			//	canJump = true;
			//}
			this.controls.moveRight( - velocity.x * delta );
			this.controls.moveForward( - velocity.z * delta );
			this.controls.getObject().position.y += ( velocity.y * delta ); // new behavior
			//if ( controls.getObject().position.y < 10 ) {
			//	velocity.y = 0;
			//	controls.getObject().position.y = 10;
			//	canJump = true;
			//}
			this.prevTime = time;
			this.velocity = velocity;
			this.velocity = direction;
  }
}

HandleControl.prototype = Object.create( THREE.EventDispatcher.prototype );
HandleControl.prototype.constructor = HandleControl;

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
	var camera, scene, renderer, controls;
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

//		var blocker = refs.blocker;//document.getElementById( 'blocker' );
///		var instructions = refs.instructions;//document.getElementById( 'instructions' );

		controls = new HandleControl( camera, refs.node, refs.instructions, refs.blocker );
		scene.add( controls.getObject() );
		raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
		// floor
		var floorGeometry = new THREE.PlaneBufferGeometry( 200, 200, 10, 10 );
		floorGeometry.rotateX( - Math.PI / 2 );
		// vertex displacement
		var position = floorGeometry.attributes.position;
		for ( var i = 0, l = position.count; i < l; i ++ ) {
			vertex.fromBufferAttribute( position, i );
			vertex.x += Math.random() * 20 - 10;
			vertex.y += Math.random() * 2;
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
		if ( controls.controls.isLocked === true ) {
			controls.update();
			raycaster.ray.origin.copy( controls.getObject().position );
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
