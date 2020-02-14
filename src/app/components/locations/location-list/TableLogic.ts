import { LocationData } from './location-list.component';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

class Group {

    level: number = 0;
    parent: Group;
    expanded: boolean = true;
    get visible(): boolean {
        return !this.parent || (this.parent.visible && this.parent.expanded);
    }
}

export class TableLogic {

    public dataSource: MatTableDataSource<LocationData>;
    private _isInGroupingMode: boolean;
    groupByColumns: string[];

    constructor(dataSource, groupByCols) {
        this.dataSource = dataSource;
        this.groupByColumns = groupByCols;
    }

    getDataRowVisible(data: LocationData): boolean {
        const groupRows = this.dataSource.data.filter(
            row => {
                if (!(row instanceof Group)) {
                    return false;
                }

                let match = true;
                this.groupByColumns.forEach(
                    column => {
                        if (!row[column] || !data[column] || row[column] !== data[column]) {
                            match = false;
                        }
                    }
                );
                return match;
            }
        );

        if (groupRows.length === 0) {
            return true;
        }
        if (groupRows.length > 1) {
            throw 'Data row is in more than one group!';
        }
        const parent = <Group>(groupRows[0] as any);  // </Group> (Fix syntax coloring)

        return parent.visible && parent.expanded;
    }

    addGroups(data: any[], groupByColumns: string[]): any[] {
        var rootGroup = new Group();
        return this.getSublevel(data, 0, groupByColumns, rootGroup);
    }

    getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
        // Recursive function, stop when there are no more levels. 
        if (level >= groupByColumns.length) {
            return data;
        }


        var groups = this.uniqueBy(
            data.map(
                row => {
                    var result = new Group();
                    result.level = level + 1;
                    result.parent = parent;
                    for (var i = 0; i <= level; i++) {
                        result[groupByColumns[i]] = row[groupByColumns[i]];
                    }
                    return result;
                }
            ),
            JSON.stringify);

        const currentColumn = groupByColumns[level];

        var subGroups = [];
        groups.forEach(group => {
            let rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
            let subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
            subGroup.unshift(group);
            subGroups = subGroups.concat(subGroup);
        });
        return subGroups;
    }

    uniqueBy(a, key) {
        var seen = {};
        return a.filter(function (item) {
            var k = key(item);
            return seen.hasOwnProperty(k) ? false : (seen[k] = true);
        });
    }

    isGroup(index, item): boolean {
        return item.level;
    }

    onToggleChange(enabled: boolean, locations: LocationData[]) {
        this._isInGroupingMode = enabled;
        this.updateGridData(locations);
    }

    public updateGridData(locations: LocationData[]) {
        if (this._isInGroupingMode) {
            this.dataSource.data = this.addGroups(locations, this.groupByColumns);

        } else {
            this.dataSource.data = locations;
        }
        this.updateGridWithDataSource();
    }

    onSortData(sort: MatSort, locations: LocationData[]) {
        let data = locations;
        if (sort.active && sort.direction !== '') {

            data = data.sort((a: LocationData, b: LocationData) => {
                const isAsc = sort.direction === 'asc';
                switch (sort.active) {
                    case 'name':
                        return this.compare(a.name, b.name, isAsc);
                    case 'address':
                        return this.compare(a.address, b.address, isAsc);
                    case 'categoryName':
                        return this.compare(a.categoryName, b.categoryName, isAsc);
                    default:
                        return 0;
                }
            });
        }
        if (this._isInGroupingMode) {
            this.dataSource.data = this.addGroups(data, this.groupByColumns);
        } else {
            this.dataSource.data = data;
        }
    }

    private compare(a, b, isAsc) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    public updateGridWithDataSource() {

        this.dataSource.filterPredicate = (data, filter: string): boolean => {
            return data.categoryName.toLowerCase().includes(filter);
        };
    }

    onApplyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
      }
}