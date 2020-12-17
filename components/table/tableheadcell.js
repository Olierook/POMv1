import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

import { c } from "../../config/colors";







const TableHeadCell = ({data, colName, requestSort, sortConfig}) => {
	return (
		<th onClick={() => requestSort(colName, data.valuetype)}>
			{
				sortConfig && sortConfig.key === colName &&
			(
				sortConfig.direction === "ascending" && <FontAwesomeIcon icon={faArrowDown} />
			||
				sortConfig.direction === "descending" && <FontAwesomeIcon icon={faArrowUp} />
			)}
			<style jsx>{`
          th{
						background-color: ${c.primary.color};
						color: ${c.primary.text};
            border: 1px solid ${c.gray_light.color};
            border-width: 0 1px 0 0;
						text-overflow: clip;
				    white-space: nowrap;
				    overflow: hidden;
						grid-column-start: ${colName};
						cursor: pointer;
						position: relative;
          }
					th:last-child {
						border-width: 0;
					}
					th{

					}
					th::after {
					  content: "${data.title || colName}";
					}
					th:hover {
						z-index: 5;
						min-width: 100%;
						width: fit-content;
						transition: width 1s linear;
					}
					th:hover::after {
						content: "${data.hovername || data.title || colName}";

					}
        `}</style>
			<style jsx global>{`
					td.${colName} {
					${data.textdisplay === "mono-right" &&
							`
							font-family: monospace;
							font-size: 1.25em;
							text-align: right;

							`}
					}
				`}</style>
		</th>


	);
};


export default TableHeadCell;
