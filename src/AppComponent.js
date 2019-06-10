import React from 'react';
import LocationList from './LocationList';

const cities = [
	'Seleccione una ciudad', 'Santiago de Compostela', 'Santander', 'Vitoria-Gasteiz', 'Pamplona',
	'Logrono', 'Valladolid', 'Zaragoza', 'Oviedo', 'Madrid', 'Barcelona',
	'Toledo', 'Valencia', 'Murcia', 'Sevilla', 'Extremadura', 'Santa Cruz de Tenerife', 'Palma de Mallorca'
];

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.formatter = this.formatter.bind(this);
		this.state = {forecastData: null, dataBar: null, city: 'Seleccione una ciudad'};
	}

	formatter(data) {
		return data.toFixed(2);
	}

	onSelectCapital(e) {
		this.setState({city: e.target.value})
		console.log(this.state.city);
	}

	render() {
		return (
			<div>
				<div style={{textAlign: 'center', marginBottom: '50px', fontSize: '30px', color: '#0D39AF'}}>
					
				</div>
				<div 
					style={{marginTop: '-3%' , fontSize: '20px', textAlign: 'center'}}><dfn>
					Portlet de Liferay realizado con React, en el que podemos elegir una ciudad entre las
					capitales de las Comunidades Autónomas de España y obtener información en gráficos sobre 
					el tiempo actual en esa ciudad y el tiempo que va a hacer durante la semana.</dfn>
				</div>
				<br></br>	
				<div style={{textAlign: 'center'}}>
					<label style={{fontSize: '15px'}}>
						<b>Ciudades</b>
					</label>
					<label>:	  </label>
					<select
						id="modal-bill-select"
						name="modal-bill-select"
						style={{borderRadius: '23px 23px 23px 23px', backgroundColor: '#F0F8FF', color: '#2F4F4F'}}
						onChange={e => this.onSelectCapital(e)}
					>
						{cities.map((item) => {
							return (
								<option
									value={item}
								>
									{item}
								</option>);
						})}
					</select>
				</div>
				<br></br>
				<div>
					{this.state.city !== 'Seleccione una ciudad' ?
						<LocationList
							city={this.state.city} >
						</LocationList> 
						:
						<div 
							style={{fontSize: '20px', textAlign: 'center'}}><b>
							Por favor, seleccione una ciudad para poder ver sus datos...</b>
						</div>
					}
				</div>
				<br></br>
				<br></br>
			</div>
		);
	}	
}