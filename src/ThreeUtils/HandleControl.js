
import * as THREE from 'three'
import { PointerLockControls } from '../ThreeUtils/PointerLockControls.js';

const HandleControl = function ( camera, domElement, instructions, blocker ) {
	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var moveUp = false;
	var moveDown = false;

	var mouseLClick = false;
	var mouseMClick = false;
	var mouseRClick = false;

	var velocity = new THREE.Vector3();
	var direction = new THREE.Vector3();
	var prevTime = performance.now();

	this.controls = new PointerLockControls( camera, domElement );
	var controls = this.controls;
  this.isLocked = controls.isLocked;

  this.getObject = function() {
		return controls.getObject();
	}

	// Toggle pointer lock on click on this element
	instructions.addEventListener( 'click', function () {
		controls.lock();
	}, false );

	controls.addEventListener( 'lock', function () {
		instructions.style.display = 'none';
		blocker.style.display = 'none';
	} );

	controls.addEventListener( 'unlock', function () {
		blocker.style.display = 'block';
		instructions.style.display = '';
	} );

	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;
			case 37: // left
			case 65: // a
				moveLeft = true;
				break;
			case 40: // down
			case 83: // s
				moveBackward = true;
				break;
			case 39: // right
			case 68: // d
				moveRight = true;
				break;
			case 16: // shift
				moveDown = true;
				break;
			case 32: // space
				//if ( canJump === true ) velocity.y += 350;
				//canJump = false;
				moveUp = true;
				break;
		}
	};

	var onKeyUp = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = false;
				break;
			case 37: // left
			case 65: // a
				moveLeft = false;
				break;
			case 40: // down
			case 83: // s
				moveBackward = false;
				break;
			case 39: // right
			case 68: // d
				moveRight = false;
				break;
			case 16: // shift
				moveDown = false;
				break;
			case 32: // space
				//if ( canJump === true ) velocity.y += 350;
				//canJump = false;
				moveUp = false;
				break;
		}
	};

	var onMouseDown = function ( event ) {
		console.log("click : ");
		switch ( event.button ) {
			case 0:
				mouseLClick = true;
				break;
			case 1:
				mouseMClick = true;
				break;
			case 2:
				mouseRClick = true;
				break;
		}
		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );
	}
	var onMouseMove = function ( event ) { }
	var onMouseUp = function ( event ) {
		switch ( event.button ) {
			case 0:
				mouseLClick = false;
				break;
			case 1:
				mouseMClick = false;
				break;
			case 2:
				mouseRClick = false;
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
		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;
		velocity.y -= velocity.y * 10.0 * delta;

		direction.z = Number( moveForward ) - Number( moveBackward );
		direction.x = Number( moveRight ) - Number( moveLeft );
		direction.y = Number( moveDown ) - Number( moveUp );
		direction.normalize(); // this ensures consistent movements in all directions

		if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
		if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
		if ( moveUp || moveDown ) velocity.y -= direction.y * 400.0 * delta;
		if ( mouseLClick ) velocity.z -= 400 * delta;
		if ( mouseRClick ) velocity.z += 400 * delta;

		controls.moveRight( - velocity.x * delta );
		controls.moveForward( - velocity.z * delta );
		controls.getObject().position.y += ( velocity.y * delta ); // new behavior

		prevTime = time;
  }
}

export { HandleControl };
