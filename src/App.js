import Footer from "./components/Footer";
import Header from "./components/Header";
import axios from "axios";
import "./css/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Component } from "react";
import $ from "jquery";

const urlGetAll = "https://local.hmartepost.com/moodle38/webservice/rest/server.php?wstoken=d04e561b2260a760d3bf04b6561c9a28&wsfunction=tool_dataprivacy_get_users&moodlewsrestformat=json&query=0";
const urlRequest = "https://local.hmartepost.com/moodle38/webservice/rest/server.php?"

class App extends Component {

	state = {
		data: [],
		dataDetail: [],
		modalInsert: false,
		modalDelete: false,
		modalDetail: false,
		form: {
			id: '',
			username: "",
			firstname: "",
			lastname: "",
			email: "",
			password: "",
			typeModal: ''
		}
	};

	requestGetAll = (id) => {
		var paramsDetail = {
			wstoken: "d04e561b2260a760d3bf04b6561c9a28",
			wsfunction: "core_user_get_users",
			moodlewsrestformat: "json",
			"criteria[0][key]": "id",
			"criteria[0][value]": id.id
		}

		var rDecodeDetail = decodeURIComponent($.param(paramsDetail));
		console.log(paramsDetail);

		var detailUrl = urlRequest + rDecodeDetail;
		console.log(detailUrl);

		axios.get(detailUrl).then((response) => {
			this.setState({ dataDetail: response.data.users });
		}).catch(error => {
			console.log(error.message);
		})
	};

	requestGet = () => {
		axios.get(urlGetAll).then((response) => {
			this.setState({ data: response.data });
		}).catch(error => {
			console.log(error.message);
		})
	};

	requestPost = async () => {
		delete this.state.form.id;
		let newUser = this.state.form;
		var params = {
			wstoken: "d04e561b2260a760d3bf04b6561c9a28",
			wsfunction: "core_user_create_users",
			moodlewsrestformat: "json",
			"users[0][username]": newUser.username,
			"users[0][firstname]": newUser.firstname,
			"users[0][lastname]": newUser.lastname,
			"users[0][email]": newUser.email,
			"users[0][password]": newUser.password
		}

		var rDecoded = decodeURIComponent($.param(params));
		console.log(params);

		var createUserUrl = urlRequest + rDecoded;
		console.log(createUserUrl);

		await axios.post(createUserUrl).then((response) => {
			this.modalInsert();
			this.requestGet();
		}).catch(error => {
			console.log(error.message);
		})
	};

	requestPut = () => {
		let updateUser = this.state.form;
		var params = {
			wstoken: "d04e561b2260a760d3bf04b6561c9a28",
			wsfunction: "core_user_update_users",
			moodlewsrestformat: "json",
			"users[0][username]": updateUser.username,
			"users[0][firstname]": updateUser.firstname,
			"users[0][lastname]": updateUser.lastname,
			"users[0][email]": updateUser.email,
			"users[0][password]": updateUser.password,
			"users[0][id]": updateUser.id
		}
		var rDecoded = decodeURIComponent($.param(params));
		console.log(params);

		var updateUserUrl = urlRequest + rDecoded;
		console.log(updateUserUrl);

		axios.put(updateUserUrl).then(response => {
			this.modalInsert();
			this.requestGet();
		}).catch(error => {
			console.log(error.message);
		})
	}

	requestDelete = () => {
		let deleteUser = this.state.form;
		var params = {
			wstoken: "d04e561b2260a760d3bf04b6561c9a28",
			wsfunction: "core_user_delete_users",
			moodlewsrestformat: "json",
			"userids[0]": deleteUser.id
		}
		var rDecoded = decodeURIComponent($.param(params));
		console.log(params);

		var deleteUserUrl = urlRequest + rDecoded;
		console.log(deleteUserUrl);

		axios.delete(deleteUserUrl).then(response => {
			this.setState({ modalDelete: false });
			this.requestGet();
		})
	}

	// End Requests

	modalInsert = () => {
		this.setState({ modalInsert: !this.state.modalInsert });
	}

	selectedUserApi = (user) => {
		this.setState({
			typeModal: 'update',
			form: {
				id: user.id,
				username: user.username,
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.email,
				password: user.password
			}
		})
	}

	handleChange = async e => {
		e.persist();
		await this.setState({
			form: {
				...this.state.form,
				[e.target.name]: e.target.value
			}
		});
	}

	componentDidMount() {
		this.requestGet();
	}

	render() {
		const { form } = this.state;
		return (
			<div className="App" id="app">
				<Header />

				<div className="container mt-5">
					<button
						className="btn btn-outline-primary font-weight-bold"
						onClick={() => {
							this.setState({ form: null, typeModal: 'insert' });
							this.modalInsert();
						}}
					>
						<FontAwesomeIcon icon={faPlus} />
						{"   "}

						Agregar usuario
					</button>
					<br />
					<br />
					<div className="table-responsive">
						<table id="dataTable" className="text-center table table-hover table-bordered table-striped table-responsive border-top-0 border-bottom-0 hovertable">
							<thead className="thead-dark">
								<tr>
									<th>ID</th>
									<th>Nombre completo</th>
									<th>Nombre de usuario</th>
									<th>Email</th>
									<th>Acciones</th>
								</tr>
							</thead>
							<tbody>
								{this.state.data.map((userApi, index) => {
									return (
										<tr key={index}>
											<td>{userApi.id}</td>
											<td>{userApi.fullname}</td>
											{userApi.extrafields.map((c, i) => (
												<td>{c.value}</td>
											))}
											<td>
												<button
													className="btn btn-outline-primary"
													onClick={() => {
														this.selectedUserApi(userApi);
														this.modalInsert()
													}}
												>
													<FontAwesomeIcon icon={faEdit} />
												</button>

												<button
													className="btn btn-outline-success"
													onClick={() => { this.selectedUserApi(userApi); this.setState({ modalDetail: true }); this.requestGetAll(userApi); }}
												>
													<FontAwesomeIcon icon={faEye} />
												</button>

												<button
													className="btn btn-outline-danger"
													onClick={() => { this.selectedUserApi(userApi); this.setState({ modalDelete: true }) }}
												>
													<FontAwesomeIcon icon={faTrashAlt} />
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
							<tfoot class="thead-dark">
								<tr>
									<th>ID</th>
									<th>Nombre completo</th>
									<th>Nombre de usuario</th>
									<th>Email</th>
									<th>Acciones</th>
								</tr>
							</tfoot>
						</table>
					</div>


					<Modal isOpen={this.state.modalDetail}>
						<ModalBody>
							<div className="text-center">
								<h4>Detalles del usuario</h4>
								{this.state.dataDetail.map(item => {
									return (
										<ul>
											<li><img className="mb-3" src={item.profileimageurl} /></li>
											<li>Id = {item.id}</li>
											<li>Username = {item.username}</li>
											<li>Firstname = {item.firstname}</li>
											<li>Lastname = {item.lastname}</li>
											<li>Fullname = {item.fullname}</li>
											<li>Email = {item.email}</li>
											<li>Autenticación = {item.auth}</li>
											<li>Lenguaje = {item.lang}</li>
										</ul>
									)
								})}
							</div>
						</ModalBody>
						<ModalFooter>
							<button className="btn btn-secondary" onClick={() => this.setState({ modalDetail: false })}>Cerrar</button>
						</ModalFooter>
					</Modal>


					<Modal isOpen={this.state.modalInsert}>
						<ModalHeader style={{ display: 'block' }}>
							<span style={{ float: 'right' }} onClick={() => this.modalInsert()}>x</span>
						</ModalHeader>
						<ModalBody>
							<div className="form-group">
								<input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id : ''} />
								<br />
								<label htmlFor="username">Nombre de usuario</label>
								<input className="form-control" type="text" name="username" id="username" onChange={this.handleChange} value={form ? form.username : ''} />
								<br />
								<label htmlFor="firstname">Nombre</label>
								<input className="form-control" type="text" name="firstname" id="firstname" onChange={this.handleChange} value={form ? form.firstname : ''} />
								<br />
								<label htmlFor="lastname">Apellido</label>
								<input className="form-control" type="text" name="lastname" id="lastname" onChange={this.handleChange} value={form ? form.lastname : ''} />
								<br />
								<label htmlFor="email">Correo electronico</label>
								<input className="form-control" type="email" name="email" id="email" onChange={this.handleChange} value={form ? form.email : ''} />
								<br />
								<label htmlFor="password">Contraseña</label>
								<input className="form-control" type="password" name="password" id="password" onChange={this.handleChange} value={form ? form.password : ''} />
							</div>
						</ModalBody>

						<ModalFooter>
							{this.state.typeModal == 'insert' ?
								<button className="btn btn-success" onClick={() => this.requestPost()}>
									Insertar
								</button> : <button className="btn btn-primary" onClick={() => this.requestPut()}>
									Actualizar
								</button>
							}
							<button className="btn btn-secondary" onClick={() => this.modalInsert()}>Cancelar</button>
						</ModalFooter>
					</Modal>


					<Modal isOpen={this.state.modalDelete}>
						<ModalBody>
							¿Estás seguro que deseas eliminar este registro?
						</ModalBody>
						<ModalFooter>
							<button className="btn btn-danger" onClick={() => this.requestDelete()}>Sí</button>
							<button className="btn btn-secondary" onClick={() => this.setState({ modalDelete: false })}>No</button>
						</ModalFooter>
					</Modal>

				</div>
				
				<Footer />

			</div>
		);
	}
}

export default App;
