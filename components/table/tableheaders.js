import React from "react";

import TableHeadCell from "./tableheadcell";
import useGlobal from "../store";



const TableHeaders = ({meta, keys, requestSort, sortConfig}) => {
	const [selectMode] = useGlobal(
		state => state.selectMode,
		() => null
	);
	const [primary] = useGlobal(
		state => state.primary,
		() => null
	);

	let colString = selectMode ? "[selectboxes] 20px " : "";
	keys.map(col => {
		if (meta[col].widthkind === "[px]min,[fr]max") {
			const [min, max] = meta[col].widthweight.split(".");
			colString += `[${col}] minmax(${min}px, ${max}fr) `;
		} else {
			let value;
			let unit;
			switch (meta[col].widthkind) {
			case "absolute":
				value = meta[col].widthweight;
				unit = "px";
				break;
			case "characters":
				value = meta[col].widthweight * 6.3 + 5;
				unit = "px";
				break;
			default:
				value = meta[col].widthweight;
				unit = "fr";

			}
			colString += `[${col}] ${value}${unit} `;
		}
	});
	colString += "[end]";
	return (
		<thead>
			<tr>
				{
					keys.map((col, i) => (
						<TableHeadCell requestSort={requestSort} sortConfig={sortConfig} data={meta[col]} colName={col} first={i===0} key={i}/>
					))
				}
			</tr>
			<style jsx>{`
        tr {
			    position: sticky;
					top: 25px;
					background-color: ${primary.color};
        }

      `}</style>
			<style jsx global>{`
				tr {
					display: grid;
		    	grid-template-columns: ${colString};
				}
			`}</style>
		</thead>
	);
};

export default TableHeaders;
