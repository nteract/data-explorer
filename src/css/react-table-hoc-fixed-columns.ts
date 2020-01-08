// just a string copy/paste for now:
/*  
'react-table-hoc-fixed-columns@6.8.6' vendorized css
'react-table-hoc-fixed-columns/lib/styles.css'
*/
// to be merged with react-table styles and combined into one styled-component

export default `

  .rthfc .rt-thead.-headerGroups,
  .rthfc .rt-thead.-header {
    z-index: 3;
  }

  .rthfc .rt-thead.-filters {
    z-index: 2;
  }

  .rthfc .rt-th,
  .rthfc .rt-td {
    
  }

  .rthfc .-headerGroups .rt-th {
    
  }

  .rthfc.-striped .rt-tr.-odd .rt-td {
    
  }

  .rthfc.-highlight .rt-tr:hover .rt-td {
    
  }

  .rthfc .-filters .rt-th.rthfc-th-fixed-left-last,
  .rthfc .rt-th.rthfc-th-fixed-left-last,
  .rthfc .rt-td.rthfc-td-fixed-left-last {
    border-right: solid 1px;
  }

  .rthfc .rt-th.rthfc-th-fixed-right-first,
  .rthfc .rt-td.rthfc-td-fixed-right-first {
    border-left: solid 1px;
  }

  /*------------ Sticky position version: -sp ------------*/

  .rthfc.-sp .rt-tbody {
    overflow: visible;
    flex: 1 0 auto;
  }

  .rthfc.-sp .rt-thead {
    position: -webkit-sticky;
    position: sticky;
  }

  .rthfc.-sp .rt-thead.-headerGroups {
    
  }

  .rthfc.-sp .rt-tfoot {
    position: -webkit-sticky;
    position: sticky;
    z-index: 1;
    bottom: 0px;
  }

  .rthfc.-sp .rthfc-th-fixed,
  .rthfc.-sp .rthfc-td-fixed {
    position: -webkit-sticky;
    position: sticky;
    z-index: 1;
  }

  .rthfc.-sp .rthfc-th-fixed-left,
  .rthfc.-sp .rthfc-td-fixed-left {
    left: 0;
  }

  .rthfc.-sp .rthfc-th-fixed-right,
  .rthfc.-sp .rthfc-td-fixed-right {
    left: 0;
  }

  /*------------ scroll event version: -se ------------*/

  .rthfc.-se .-header .rt-th.rthfc-th-fixed,
  .rthfc.-se .-headerGroups .rt-th.rthfc-th-fixed,
  .rthfc.-se .-filters .rt-th.rthfc-th-fixed,
  .rthfc.-se .rt-td.rthfc-td-fixed {
    position: relative;
    z-index: 1;
  }
`;
