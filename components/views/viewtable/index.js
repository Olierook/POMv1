import React, {useState, useEffect} from "react";
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

import { allOptions, allOptionsWithData } from "../../../config/viewOptions";
import { c } from "../../../config/colors";
import { useSortableData } from "../../../lib/custom-hooks";







const ViewTable = ({data, mode}) => {
	const {view_name, created_at, updated_at, config, ...viewdata} = data || {};
	// belangrijk om alle niet-JSON hierboven weg te filteren
	const [dataState, setDataState] = useState({});
	const { keys, requestSort, sortConfig } = useSortableData(dataState);
	const fakedata = new Array(50).fill(".");
	
	useEffect(() => {
		let _dataState = {};
		Object.keys(viewdata).map(key => {
			console.log(viewdata[key]);
			_dataState[key] = JSON.parse(viewdata[key]) || {};
			allOptions.map(option => {
				_dataState[key][option] =
					_dataState[key][option] === undefined
						? allOptionsWithData[option].default
						: _dataState[key][option];
			});
		});
		console.log(dataState);
		setDataState(_dataState);

	}, [Object.keys(viewdata)[0]]);

	const saveData = async (attr) => {
		const value = JSON.stringify(dataState[attr]);
		if (value !== viewdata[attr]) {
			try {
				const res = await fetch("/api/edit-view", {
					method: "PATCH",
					body: JSON.stringify({
						attr,
						view_name,
						value
					}),
					headers: {
						"Content-type": "application/json; charset=UTF-8"
					}
				});
				const json = await res.json();
				if (!res.ok) throw Error(json.message);
			} catch (e) {
				throw Error(e.message);
			}
		}
	};
	console.log(allOptions);
	return (
		<div className="container">
			<table>
				<colgroup>
					<col key={0} span={1} className={"firstcol evencols"} style={{}}/>
					{allOptions.map((h, i) => <col key={i+1} span={1} className={"evencols"}/>)}
				</colgroup>
				<thead>
					<tr>
						<th className="crossdivider" onClick={() => requestSort(null)}>{sortConfig && sortConfig.key && <FontAwesomeIcon icon={faTimes} />}</th>
						{allOptions.map((option, i) => <th key={i} onClick={() => requestSort(option,
							typeof allOptionsWithData[option].input === "string" ? allOptionsWithData[option].input : "text" )}>{option}
							{
								sortConfig && sortConfig.key === option &&
							(
								sortConfig.direction === "ascending" && <FontAwesomeIcon icon={faArrowDown} />
							||
								sortConfig.direction === "descending" && <FontAwesomeIcon icon={faArrowUp} />
							)}
						</th>)}
					</tr>
				</thead>
				<tbody>
					{Object.keys(dataState)[0] ?
						keys.map((attribute, i) => (
							<tr key={i}>
								<td key={0} className="firstcol">{attribute}</td>
								{allOptions.map((option, j) =>
									<td key={j+1}>
										{mode === "edit" ?
											<>
												{typeof allOptionsWithData[option].input === "string" ?
													<input
														type={allOptionsWithData[option].input}
														className={"optionInput"}
														value={dataState[attribute] && dataState[attribute][option] ? dataState[attribute][option] : ""}
														placeholder={dataState[attribute] && dataState[attribute][option] === null ? "-" : null  }
														onChange={(event) => setDataState({...dataState, [attribute]: {...dataState[attribute], [option]: event.target.value}})}
														onBlur={() => saveData(attribute)}
													/>
													:
													<select
														className={"optionInput"}
														value={dataState[attribute] && dataState[attribute][option] ? dataState[attribute][option] : ""}
														onChange={(event) => setDataState({...dataState, [attribute]: {...dataState[attribute], [option]: event.target.value}})}
														onBlur={() => saveData(attribute)}
													>
														{allOptionsWithData[option].input.map((optionvalue, k) =>
															<option value={optionvalue} key={k}>{optionvalue}</option>
														)}
													</select>
												}
											</>
											:
											<>
												{dataState[attribute] && dataState[attribute][option] ? dataState[attribute][option] : "-"}
											</>
										}
									</td>

								)}
							</tr>
						))
						:
						<>
							{fakedata.map((dot, row) => (
								<tr key={row}>
									<td key={0}>
										<SkeletonTheme color={c.primary_very_light.color} highlightColor={"white"}>
											<Skeleton />
										</SkeletonTheme>
									</td>
									{allOptions.map((option, i) =>
										<td key={i+1}>
											<SkeletonTheme color={c.primary_very_light.color} highlightColor={"white"}>
												<Skeleton color={c.primary.color} highlightColor={c.primary_very_light}/>
											</SkeletonTheme>
										</td>
									)}
								</tr>
							))}
						</>
					}
				</tbody>
			</table>
			<style jsx>{`
				.container{
					width: calc(100% - 30px);
					overflow: auto;
					height: calc(100vh - 68.67px);
					position: relative;
					top: 15px;
					left: 15px;
					/* right: -15px;
					bottom: -15px; */
				}
				.evencols{
					width: ${(1/(allOptions.length+1)) * 100}%;
				}
				table{
					background-color: white;
					border-collapse: collapse;
					width: 100%;
				}

				tr:nth-child(even){
					background-color: ${c.gray_very_light.color};
				}
				colgroup {
					width: 100%;
				}
				.crossdivider {
					background-color: ${c.primary_very_light.color};
					color: ${c.primary_very_light.text};
				}
				td {
					text-align: right;
					border: 1px solid ${c.gray_light.color};
					border-width: 0 1px 1px 0;
					padding: 1px 7px;
				}
				td:nth-last-child(1) {
					border-width: 0 0 1px 0;
				}
				th{
					background-color: ${c.primary.color};
					color: ${c.primary.text};
					border: 1px solid ${c.gray_light.color};
					border-width: 0 1px 0 0;
					position: sticky;
					top: 0;
					cursor: pointer;
				}
				th:last-child {
					border-width: 0;
				}
				.firstcol{
					font-weight: bold;
					text-align: left;
				}
				.optionInput{
					width: 100%;
					/* border: 2px solid ${c.primary.color}; */

				}

			`}</style>
		</div>
	);
};

export default ViewTable;
