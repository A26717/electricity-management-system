import React, { useState } from 'react';
import {
  Card,
  Input,
  Select,
  DatePicker,
  Button,
  Tag,
  Badge
} from 'antd';
import {
  SearchOutlined,
  ClearOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AdvancedSearchFilters = ({
  onSearch,
  onFilterChange,
  onClear,
  filters = [],
  searchPlaceholder = 'Search...',
  showDateRange = true,
  showClearButton = true,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [dateRange, setDateRange] = useState(null);

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...activeFilters, [key]: value };
    setActiveFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    if (onFilterChange) {
      onFilterChange({ ...activeFilters, dateRange: dates });
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setActiveFilters({});
    setDateRange(null);
    if (onClear) {
      onClear();
    }
  };

  const filterCount = Object.keys(activeFilters).filter(key => activeFilters[key] && activeFilters[key] !== 'all').length;

  return (
    <Card className="mb-4">
      <div className="flex flex-wrap gap-4 items-center">
        <Search
          placeholder={searchPlaceholder}
          style={{ width: 280 }}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
          allowClear
          enterButton
          loading={loading}
        />

        {filters.map((filter) => (
          <Select
            key={filter.key}
            style={{ width: filter.width || 150 }}
            value={activeFilters[filter.key] || 'all'}
            onChange={(value) => handleFilterChange(filter.key, value)}
            placeholder={filter.placeholder || 'Filter'}
            allowClear
          >
            <Option value="all">All {filter.label}s</Option>
            {filter.options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        ))}

        {showDateRange && (
          <RangePicker
            onChange={handleDateRangeChange}
            value={dateRange}
            placeholder={['Start Date', 'End Date']}
          />
        )}

        {showClearButton && (
          <Button
            icon={<ClearOutlined />}
            onClick={handleClear}
            disabled={!searchTerm && filterCount === 0 && !dateRange}
          >
            Clear Filters
          </Button>
        )}

        <Badge count={filterCount} color="blue" className="ml-auto">
          <span className="text-sm text-gray-500">
            {filterCount > 0 ? `${filterCount} filter(s) active` : 'No filters active'}
          </span>
        </Badge>
      </div>

      {/* Active filter tags */}
      {filterCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {searchTerm && (
            <Tag closable onClose={() => handleSearch('')}>
              Search: {searchTerm}
            </Tag>
          )}
          {Object.keys(activeFilters).map((key) => {
            if (activeFilters[key] && activeFilters[key] !== 'all') {
              const filter = filters.find(f => f.key === key);
              const option = filter?.options.find(o => o.value === activeFilters[key]);
              return (
                <Tag
                  key={key}
                  color="blue"
                  closable
                  onClose={() => handleFilterChange(key, 'all')}
                >
                  {filter?.label}: {option?.label || activeFilters[key]}
                </Tag>
              );
            }
            return null;
          })}
          {dateRange && (
            <Tag
              color="cyan"
              closable
              onClose={() => handleDateRangeChange(null)}
            >
              {dateRange[0]?.format('YYYY-MM-DD')} → {dateRange[1]?.format('YYYY-MM-DD')}
            </Tag>
          )}
        </div>
      )}
    </Card>
  );
};

export default AdvancedSearchFilters;